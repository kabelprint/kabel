import { useEffect, useState } from "react";
import { supabase } from "./supabase";


function Admin() {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
    else console.log(error);
    
  }
  const [password, setPassword] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);

const ADMIN_PASSWORD = "100200**";

  async function updateStatus(id, status) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      loadOrders();
    } else {
      console.log(error);
      alert("حدث خطأ أثناء تحديث الحالة");
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);
  async function deleteOrder(id) {
  const confirmed = window.confirm("هل تريد حذف الطلب؟");

  if (!confirmed) return;

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    alert("حدث خطأ أثناء الحذف");
  } else {
    loadOrders();
  }
}
if (!isLoggedIn) {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>دخول لوحة الإدارة</h2>

      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "12px", width: "250px" }}
      />

      <br /><br />

      <button
        onClick={() => {
          if (password === ADMIN_PASSWORD) {
            setIsLoggedIn(true);
          } else {
            alert("كلمة المرور غير صحيحة");
          }
        }}
      >
        دخول
      </button>
    </div>
  );
}

  return (
    <div style={{ padding: "20px" }}>
      <h1>لوحة طلبات Kabel</h1>

      <table border="1" cellPadding="10">
        <thead>
  <tr>
    <th>العميل</th>
    <th>الهاتف</th>
    <th>النسخ</th>
    <th>الألوان</th>
    <th>الطباعة</th>
    <th>طريقة الاستلام</th>
    <th>العنوان</th>
    <th>الملف</th>
    <th>الحالة</th>
    <th>تغيير الحالة</th>
    <th>حذف</th>
  </tr>
</thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customer_name}</td>
              <td>{order.phone}</td>
              <td>{order.copies}</td>
              <td>{order.color_mode}</td>
              <td>{order.print_type}</td>
              <td>{order.delivery_type}</td>
              <td>{order.address || "-"}</td>
              <td>
                {order.file_url ? (
                  <a href={order.file_url} target="_blank">
                    فتح الملف
                  </a>
                ) : (
                  "لا يوجد"
                )}
              </td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="pending">جديد</option>
                  <option value="printing">جاري الطباعة</option>
                  <option value="ready">جاهز للاستلام</option>
                  <option value="completed">تم التسليم</option>
                </select>
              </td>
              <td>
  <button onClick={() => deleteOrder(order.id)}>
    حذف
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;