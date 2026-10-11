import PageHeader from '../components/PageHeader';
import '../styles/pages.css';

const STATS = [
  { label: 'Registered users', value: '70' },
  { label: 'Connected devices', value: '192' },
  { label: 'Active hotspots', value: '2' },
  { label: 'Portal sessions today', value: '34' },
];

const HOTSPOTS = [
  { name: 'Store-WiFi', devices: 128, capacity: '42%' },
  { name: 'Store-Guest', devices: 64, capacity: '28%' },
];

const RECENT_USERS = [
  { name: 'John M.', device: 'iPhone 15', connected: '2 min ago' },
  { name: 'Sarah K.', device: 'MacBook Pro', connected: '8 min ago' },
  { name: 'Alex T.', device: 'Samsung S24', connected: '15 min ago' },
];

function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />

      <div className="page-content">
        <dl className="stat-list">
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-item">
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>

        <section className="section">
          <h2>WiFi overview</h2>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Network</th>
                  <th>Devices</th>
                  <th>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {HOTSPOTS.map((hotspot) => (
                  <tr key={hotspot.name}>
                    <td>{hotspot.name}</td>
                    <td>{hotspot.devices}</td>
                    <td>{hotspot.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <h2>Recently connected</h2>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Device</th>
                  <th>Connected</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((user) => (
                  <tr key={user.name}>
                    <td>{user.name}</td>
                    <td>{user.device}</td>
                    <td>{user.connected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default DashboardPage;
