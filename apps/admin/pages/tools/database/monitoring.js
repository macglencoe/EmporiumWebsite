
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import Layout from '../../../components/layout';
import PageTitle1 from '../../../components/pagetitle1';
import { rememberScan } from '../../../lib/database/tools.mjs';

const formatTime = (hour) =>
  new Date(hour).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export default function NeonMonitoringPage() {
  const [records, setRecords] = useState([]);
  const [range, setRange] = useState(48);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/tools/neon-monitoring/');
        if (!response.ok) {
          throw new Error('Unable to retrieve monitoring data.');
        }

        const result = await response.json();
        setRecords(result.data || []);
        rememberScan('monitoring', { status: 'viewed', checkedAt: new Date().toISOString(), count: (result.data || []).length });
      } catch (err) {
        setError(err.message);
        rememberScan('monitoring', { status: 'failed', checkedAt: new Date().toISOString() });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const data = useMemo(() => {
    const cutoff = Date.now() - range * 60 * 60 * 1000;

    return records
      .filter((record) => new Date(record.hour).getTime() >= cutoff)
      .sort((a, b) => new Date(a.hour) - new Date(b.hour))
      .map((record) => ({
        ...record,
        timestamp: new Date(record.hour).getTime(),
        label: formatTime(record.hour),
        usage: record.compute_unit_hours,
      }));
  }, [records, range]);

  const total = data.reduce((sum, row) => sum + row.usage, 0);
  const average = data.length ? total / data.length : 0;
  const latest = data.length ? data[data.length - 1] : null;

  return (
    <Layout>
      <Head>
          <title>Usage &amp; Monitoring | King Street Emporium Admin</title>
      </Head>

      <PageTitle1>Usage &amp; Monitoring</PageTitle1>

      <main className="monitoring">
        <p>
          <Link href="/tools/database">
            <a>← Database Dashboard</a>
          </Link>
        </p>

        <div className="toolbar">
          <h2>Compute Consumption</h2>

          <select
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
            aria-label="Select time range"
          >
            <option value={24}>Last 24 hours</option>
            <option value={48}>Last 48 hours</option>
            <option value={168}>Last 7 days</option>
            <option value={720}>Last 30 days</option>
          </select>
        </div>

        {loading && <p role="status">Loading monitoring data…</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && (
          <>
            <div className="stats">
              <div className="stat">
                <span>Total Consumption</span>
                <strong>{total.toFixed(3)} CU-h</strong>
              </div>

              <div className="stat">
                <span>Average per Recorded Hour</span>
                <strong>{average.toFixed(3)} CU</strong>
              </div>

              <div className="stat">
                <span>Latest Recorded Hour</span>
                <strong>
                  {latest
                    ? `${latest.usage.toFixed(3)} CU-h`
                    : 'N/A'}
                </strong>
              </div>
            </div>

            {data.length > 0 ? (
              <section className="chart">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={data}
                    margin={{ top: 15, right: 25, bottom: 15, left: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="timestamp"
                      type="number"
                      scale="time"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('en-US', {
                          timeZone: 'America/New_York',
                          month: 'short',
                          day: 'numeric',
                        })
                      }
                      minTickGap={35}
                    />

                    <YAxis
                      domain={[0, 'auto']}
                      tickFormatter={(value) => value.toFixed(2)}
                      width={55}
                    />

                    <Tooltip
                      labelFormatter={(value) => formatTime(value)}
                      formatter={(value) => [
                        `${Number(value).toFixed(4)} CU-h`,
                        'Compute Usage',
                      ]}
                    />

                    <Line
                      type="linear"
                      dataKey="usage"
                      stroke="#800020"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5 }}
                      connectNulls={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </section>
            ) : (
              <p>No monitoring records available for this period.</p>
            )}

            {latest && (
              <p className="updated">
                Latest recorded interval: {latest.label}
              </p>
            )}
          </>
        )}
      </main>

      <style jsx>{`
        .monitoring {
          max-width: 1100px;
          margin: 1rem auto 4rem;
          padding: 0 1rem;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .toolbar h2 {
          margin: 0;
        }

        select {
          padding: 0.6rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          background: white;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.25rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }

        .stat span {
          font-size: 0.85rem;
          color: #666;
        }

        .stat strong {
          font-size: 1.5rem;
          color: #292724;
        }

        .chart {
          padding: 1.5rem 0.5rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }

        .note,
        .updated {
          color: #777;
          font-size: 0.85rem;
          margin-top: 1rem;
          text-align: center;
        }

        @media (max-width: 650px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .toolbar {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </Layout>
  );
}

