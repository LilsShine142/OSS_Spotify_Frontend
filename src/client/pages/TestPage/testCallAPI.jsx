import { useEffect, useState } from "react";
import { getAllAccounts } from "../../../services/accountService";

const TestCallAPI = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAllAccounts()
      .then((data) => setAccounts(data))
      .catch((error) => console.error("Lỗi:", error));
  }, []);

  return (
    <div>
      <h2>Danh sách tài khoản</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.username}>{account.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestCallAPI;
