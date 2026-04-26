import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { AlertTriangle, Database } from "lucide-react";
import StatCard from "./statcard";
import Loader from "./Loader";

type DataType = {
  city: string;
  crime: string;
  date: string;
  count: number;
  anomaly: number;
};

export default function Dashboard() {

  const [data, setData] = useState<DataType[]>([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    let url = "http://127.0.0.1:5000/dashboard";

    if (city) {
      url += `?city=${city}`;
    }

    const res = await axios.get(url);
    setData(res.data.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const anomalyCount = data.filter(d => d.anomaly === 1).length;

  return (
    <div className="container">

      <h1 className="header">Rakshitra</h1>

      <div className="card">
        <input
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchData}>Search</button>
      </div>

      <div className="grid">
        <StatCard
          title="Total Records"
          value={data.length}
          icon={<Database size={20} />}
        />

        <StatCard
          title="Anomalies"
          value={anomalyCount}
          icon={<AlertTriangle size={20} />}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="card">
            <h3>Crime Trend</h3>

            <LineChart width={900} height={300} data={data}>
              <CartesianGrid stroke="#ddd" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </div>

          <div className="card">
            <h3>Anomaly Detection</h3>

            <table>
              <thead>
                <tr>
                  <th>City</th>
                  <th>Crime</th>
                  <th>Date</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d, i) => (
                  <tr key={i} className={d.anomaly === 1 ? "anomaly" : ""}>
                    <td>{d.city}</td>
                    <td>{d.crime}</td>
                    <td>{d.date}</td>
                    <td>{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
}