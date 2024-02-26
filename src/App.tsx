import React, { startTransition, useEffect, useState } from "react";
import "./App.css";
import LoadProfile from "./components/LoadProfile";
import Filter from "./components/Filter";
import Console from "./components/Console";
import { ConfigProvider, Flex, message, theme } from "antd";
import Previewer from "./components/Previewer";
import { useDebounce } from "react-use";
import Timeline from "./components/Timeline";

interface LogEvent extends Record<string, any> {
  time: number;
}

function App() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEvent[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0]);
  const [range, setRange] = useState<[number, number]>([0, 0]);

  const parseJSONfromFile = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const list = (reader.result as string).split("\n");
        setLogs(list.map((item) => JSON.parse(item)));
        setLoading(false);
        message.success("File loaded successfully");
      } catch (error) {
        message.error("Invalid ND-JSON file");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (logs.length > 0) {
      const range: [number, number] = [
        logs[0]?.time || 0,
        logs[logs.length - 1]?.time || 0,
      ];
      setTimeRange(range);
      setRange(range);
    }
  }, [logs]);

  useDebounce(
    () => {
      const validLogs = logs.filter(
        (log) => log.time >= range[0] && log.time <= range[1]
      );

      if (!searchText) {
        setLoading(false);
        startTransition(() => {
          setFilteredLogs(validLogs);
        });
        return;
      }
      const lines = searchText.split("\n");
      const texts = lines
        .filter((line) => !line.startsWith("//"))
        .map((line) =>
          line
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        );

      const result = validLogs.filter((log) => {
        const logString = JSON.stringify(log).toLowerCase();

        if (
          texts.length > 0 &&
          !texts.some((text) =>
            text.every((t) => logString.includes(t.toLowerCase()))
          )
        ) {
          return false;
        }

        return true;
      });

      setLoading(false);
      startTransition(() => {
        setFilteredLogs(result);
      });
    },
    1000,
    [logs, searchText, range]
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.darkAlgorithm],
        token: {
          colorPrimary: "#ff6d00",
        },
      }}
    >
      <div className="App">
        <Flex vertical gap="middle" align="stretch" style={{ height: "100%" }}>
          <Flex vertical={false} gap="middle" align="stretch">
            <LoadProfile onFileChange={parseJSONfromFile} loading={loading} />
            <Filter
              value={searchText}
              onChange={(text) => {
                setSearchText(text);
                setLoading(true);
              }}
            />
          </Flex>
          <Timeline
            timeRange={timeRange}
            range={range}
            onRangeChange={(newRange) => {
              setRange(newRange);
              setLoading(true);
            }}
          />
          <Flex
            vertical={false}
            gap="middle"
            align="stretch"
            style={{ flex: 1, overflowY: "hidden" }}
          >
            <Console data={filteredLogs} onRowClick={setSelectedLog} />
            <Previewer data={selectedLog} />
          </Flex>
        </Flex>
      </div>
    </ConfigProvider>
  );
}

export default App;
