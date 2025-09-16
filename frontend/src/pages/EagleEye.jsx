import React, { useEffect, useState } from "react";

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const regionColors = {
  East: { region: "#ff9999", gm: "#ffc2c2" },
  West: { region: "#99ccff", gm: "#cce6ff" },
  North: { region: "#99ff99", gm: "#ccffcc" },
  South: { region: "#ffd699", gm: "#ffe6cc" },
  Middle: { region: "#d9b3ff", gm: "#e6ccff" },
};

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(day)}/${parseInt(month)}/${year}`;
};

const SheetTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/eagle-data");
        const result = await response.json();
        if (result.values) {
          setData(result.values);
        } else {
          console.error("No data found from backend", result);
        }
      } catch (error) {
        console.error("Error fetching data from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-3">Loading data...</p>;
  if (!data.length) return <p className="p-3">No data available</p>;

  const rows = data.slice(1);

  const regionIndex = 0;
  const gmIndex = 1;
  const dateIndex = 2;
  const hourStartIndex = 3;
  const hourEndIndex = 27;

  const filteredRows = rows.filter((row) => {
    const rowDate = row[dateIndex]?.trim();
    const formattedSelectedDate = formatDate(selectedDate);
    // Include all rows if no date is selected, or if the date matches
    return !selectedDate || rowDate === formattedSelectedDate;
  });

  const getCellStyle = (value, gmName) => {
    const num = parseFloat(String(value).replace("%", "")) || 0;
    if (
      gmName.toLowerCase() === "total" ||
      gmName.toLowerCase() === "grand total"
    ) {
      if (num >= 90) return { backgroundColor: "#00b050", color: "white" };
      if (num >= 60) return { backgroundColor: "#92d050", color: "black" };
      return { backgroundColor: "#ff0000", color: "white" };
    } else {
      if (num >= 90) return { backgroundColor: "#b6f2b6" };
      if (num >= 60) return { backgroundColor: "#fff49a" };
      return { backgroundColor: "#f28b82" };
    }
  };

  const getRegionRowSpan = (startIdx) => {
    if (startIdx < 0 || startIdx >= filteredRows.length) return 0;
    const currentRegion = filteredRows[startIdx][regionIndex];
    let span = 0;
    for (let i = startIdx; i < filteredRows.length; i++) {
      if (filteredRows[i] && filteredRows[i][regionIndex] === currentRegion) {
        span++;
      } else {
        break;
      }
    }
    return span;
  };

  let lastRegion = null;

  return (
    <>
    <nav
        className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top"
        style={{
          backgroundColor: "#072c62",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src="Ekart Logo White.png"
            alt="eKart Logo"
            height="40"
            className="me-2"
          />
        </a>
      </nav>
    
    <div className="cswrap eagleye">
      

      <div style={{ padding: "10px" }}>
        <label style={{ marginRight: "10px" }}>Select Date: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ marginBottom: "20px", padding: "5px" }}
        />

        <div style={{ maxHeight: "75vh", overflow: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    background: "#2f5597",
                    color: "white",
                    padding: "8px",
                    position: "sticky",
                    left: 0,
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  Region
                </th>
                <th
                  style={{
                    background: "#2f5597",
                    color: "white",
                    padding: "8px",
                    position: "sticky",
                    left: "60px",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  GM
                </th>
                {hours.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      background: "#2f5597",
                      color: "white",
                      padding: "8px",
                      position: "sticky",
                      top: 0,
                      zIndex: 5,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((row, i) => {
                const regionName = row[regionIndex];
                const gmName = row[gmIndex];
                const hourData = row.slice(hourStartIndex, hourEndIndex + 1);

                const renderRegionCell = lastRegion !== regionName;
                if (renderRegionCell) {
                  lastRegion = regionName;
                }
                const regionRowSpan = renderRegionCell
                  ? getRegionRowSpan(i)
                  : 0;

                return (
                  <tr key={i}>
                    {renderRegionCell && (
                      <td
                        rowSpan={regionRowSpan}
                        style={{
                          padding: "6px",
                          border: "1px solid #ddd",
                          fontWeight: "bold",
                          backgroundColor:
                            regionColors[regionName]?.region || "#ccc",
                          verticalAlign: "middle",
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                        }}
                      >
                        {regionName}
                      </td>
                    )}
                    <td
                      style={{
                        padding: "6px",
                        border: "1px solid #ddd",
                        fontWeight: "bold",
                        backgroundColor:
                          gmName?.trim().toLowerCase() === "total" ||
                          gmName?.trim().toLowerCase() === "grand total"
                            ? regionColors[regionName]?.region || "#f2f2f2"
                            : regionColors[regionName]?.gm || "#f2f2f2",
                        whiteSpace: "nowrap",
                        position: "sticky",
                        left: "60px",
                        zIndex: 1,
                      }}
                    >
                      {gmName}
                    </td>

                    {hourData.map((val, hIndex) => (
                      <td
                        key={hIndex}
                        style={{
                          ...getCellStyle(val, gmName),
                          padding: "6px",
                          border: "1px solid #ddd",
                        }}
                      >
                        {val || "0.00%"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default SheetTable;
