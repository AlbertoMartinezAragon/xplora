import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

interface Account {
  id: string;
  name: string;
  email: string;
  devices: { id: string; name: string }[];
}

const GET_ACCOUNTS = gql`
  query {
    accounts {
      id
      name
      email
      devices {
        id
        name
      }
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($name: String!, $email: String!) {
    createAccount(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

const CREATE_DEVICE = gql`
  mutation CreateDevice($accountId: ID!, $name: String!) {
    createDevice(accountId: $accountId, name: $name) {
      id
      name
    }
  }
`;

const App = () => {
  const { loading, error, data, refetch } = useQuery(GET_ACCOUNTS);
  const [createAccount] = useMutation(CREATE_ACCOUNT, {
    onCompleted: () => refetch(),
  });
  const [createDevice] = useMutation(CREATE_DEVICE, {
    onCompleted: () => refetch(),
  });

  const [accountName, setAccountName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Accounts</h1>
      <ul>
        {data.accounts.map((account: Account) => (
          <li key={account.id}>
            <strong>{account.name}</strong> ({account.email})
            <ul>
              {account.devices.map((device) => (
                <li key={device.id}>{device.name}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Create Account</h2>
      <input
        type="text"
        placeholder="Name"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={accountEmail}
        onChange={(e) => setAccountEmail(e.target.value)}
      />
      <button
        onClick={() => createAccount({ variables: { name: accountName, email: accountEmail } })}
      >
        Create Account
      </button>

      <h2>Create Device</h2>
      <select onChange={(e) => setSelectedAccountId(e.target.value)}>
        <option value="">Select Account</option>
        {data.accounts.map((account: Account) => (
          <option key={account.id} value={account.id}>{account.name}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Device Name"
        value={deviceName}
        onChange={(e) => setDeviceName(e.target.value)}
      />
      <button
        onClick={() =>
          createDevice({ variables: { accountId: selectedAccountId, name: deviceName } })
        }
        disabled={!selectedAccountId}
      >
        Create Device
      </button>
    </div>
  );
};

export default App;
