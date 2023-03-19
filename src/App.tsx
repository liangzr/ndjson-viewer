import React, { useMemo } from 'react'
import './App.css'
import LoadProfile from './components/LoadProfile'
import Filter from './components/Filter'
import Console from './components/Console'
import { message, Space } from 'antd'

interface LogEvent extends Record<string, any> {
  time: number
}

function App() {
  const [logs, setLogs] = React.useState<LogEvent[]>([])
  const [searchText, setSearchText] = React.useState<string>('')

  const parseJSONfromFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const list = (reader.result as string).split('\n')
        setLogs(list.map((item) => JSON.parse(item)))
        message.success('File loaded successfully')
      } catch (error) {
        message.error('Invalid ND-JSON file')
      }
    }
    reader.readAsText(file)
  }

  console.log(logs)
  const filteredLogs = useMemo(() => {
    if (!searchText) return logs
    const lines = searchText.split('\n')
    const includes = lines
      .filter((line) => line.startsWith('include:'))
      .map((line) =>
        line
          .replace('include:', '')
          .split(',')
          .map((item) => item.trim())
      )
    const excludes = lines
      .filter((line) => line.startsWith('exclude:'))
      .map((line) =>
        line
          .replace('exclude:', '')
          .split(',')
          .map((item) => item.trim())
      )
    const texts = lines
      .filter((line) => !line.startsWith('include:') && !line.startsWith('exclude:') && !line.startsWith('//'))
      .filter(Boolean)
      .map((line) =>
        line
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      )

    return logs.filter((log) => {
      const logString = JSON.stringify(log).toLowerCase()
      const fields = Object.keys(log)
      if (includes.length > 0 && !includes.some((include) => include.every((inc) => fields.includes(inc)))) return false
      if (excludes.length > 0 && excludes.some((exclude) => exclude.every((exc) => fields.includes(exc)))) return false
      if (texts.length > 0 && !texts.some((text) => text.every((t) => logString.includes(t.toLowerCase()))))
        return false

      return true
    })
  }, [logs, searchText])

  return (
    <div className="App">
      <Space direction="vertical">
        <LoadProfile onFileChange={parseJSONfromFile} />
        <Filter value={searchText} onChange={setSearchText} />
        <Console data={filteredLogs} />
      </Space>
    </div>
  )
}

export default App
