import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchUsers } from '@/services/adminService';

const COLORS = ['#4F46E5', '#F59E0B', '#EF4444', '#10B981'];

function Statistical() {
  const [stats, setStats] = useState({
    user_count: 0,
    premium_user_count: 0,
    blocked_user_count: 0,
    active_user_count: 0,
  });

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await fetchUsers();
      const users = res?.results?.data;

      if (users && Array.isArray(users)) {
        const total = res.count;

        const premium = users.filter(
          user => user.premium_expired_at && new Date(user.premium_expired_at) > new Date()
        ).length;

        const blocked = users.filter(user => user.isHidden === true).length;
        const active = total - blocked;

        setStats({
          user_count: total,
          premium_user_count: premium,
          blocked_user_count: blocked,
          active_user_count: active,
        });
      } else {
        console.error("Không có dữ liệu người dùng hoặc kết quả không đúng định dạng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
  };

  const pieData = [
    { name: 'Premium', value: stats.premium_user_count },
    { name: 'Hoạt động', value: stats.active_user_count },
    { name: 'Bị chặn', value: stats.blocked_user_count },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Thống kê người dùng</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold">Tổng người dùng</div>
            <div className="text-3xl font-bold text-blue-600">{stats.user_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold">Tài khoản Premium</div>
            <div className="text-3xl font-bold text-yellow-500">{stats.premium_user_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold">Người dùng bị chặn</div>
            <div className="text-3xl font-bold text-red-600">{stats.blocked_user_count}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold">Người dùng hoạt động</div>
            <div className="text-3xl font-bold text-green-600">{stats.active_user_count}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Biểu đồ phân bố người dùng</h2>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Statistical;
