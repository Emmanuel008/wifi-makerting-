import PageHeader from '../components/PageHeader';
import '../styles/pages.css';

const USERS = [
  { name: 'John M.', phone: '+254 712 345 678', registered: 'Jan 12, 2026', visits: 14, lastSeen: 'Today' },
  { name: 'Sarah K.', phone: '+254 733 987 654', registered: 'Jan 18, 2026', visits: 8, lastSeen: 'Today' },
  { name: 'Alex T.', phone: '+254 701 222 333', registered: 'Feb 2, 2026', visits: 3, lastSeen: 'Today' },
  { name: 'Grace W.', phone: '+254 722 444 555', registered: 'Feb 10, 2026', visits: 6, lastSeen: 'Yesterday' },
  { name: 'Peter O.', phone: '+254 711 666 777', registered: 'Mar 1, 2026', visits: 1, lastSeen: 'Mar 5, 2026' },
];

function UserManagementPage() {
  return (
    <>
      <PageHeader title="User Management" />

      <div className="page-content">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Registered</th>
                <th>Visits</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((user) => (
                <tr key={user.phone}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.registered}</td>
                  <td>{user.visits}</td>
                  <td>{user.lastSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default UserManagementPage;
