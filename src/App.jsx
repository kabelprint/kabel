import { useState } from "react";
import { supabase } from "./supabase";
import Admin from "./Admin";
import "./App.css";
function App() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState("أبيض وأسود");
  const [printType, setPrintType] = useState("وش فقط");
  const [paperSize, setPaperSize] = useState("A4");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [deliveryType, setDeliveryType] = useState("استلام من المكتبة");
const [address, setAddress] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let fileUrl = "";

    if (file) {
     const extension = file.name.split(".").pop();
const fileName = Date.now() + "." + extension;

      const { error: uploadError } = await supabase.storage
        .from("order - files")
        .upload(fileName, file);

      if (uploadError) {
        console.log(uploadError);
        setMessage("حدث خطأ أثناء رفع الملف");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("order - files")
        .getPublicUrl(fileName);

      fileUrl = data.publicUrl;
    }

    const { error } = await supabase.from("orders").insert({
      customer_name: customerName,
      phone,
      copies: Number(copies),
      color_mode: colorMode,
      print_type: printType,
      paper_size: paperSize,
      delivery_type: deliveryType,
address: address,
      file_url: fileUrl,
      status: "pending",
    });

    if (error) {
      console.log(error);
      setMessage("حدث خطأ أثناء إرسال الطلب");
    } else {
      setMessage("تم إرسال الطلب بنجاح ✅");
      const whatsappNumber = "201095042810";

const whatsappText =
  "طلب طباعة جديد%0A" +
  "الاسم: " + customerName + "%0A" +
  "الهاتف: " + phone + "%0A" +
  "عدد النسخ: " + copies + "%0A" +
  "الألوان: " + colorMode + "%0A" +
  "طريقة الطباعة: " + printType + "%0A" +
  "طريقة الاستلام: " + deliveryType + "%0A" +
"العنوان: " + address + "%0A" +
  "حجم الورق: " + paperSize + "%0A" +
  "رابط الملف: " + fileUrl;

window.open("https://wa.me/" + whatsappNumber + "?text=" + whatsappText, "_blank");



      setCustomerName("");
      setPhone("");
      setCopies(1);
      setFile(null);
    }

    setLoading(false);
  }
if (window.location.pathname === "/admin") {
  return <Admin />;
}
  return (
  <div className="page" dir="rtl">
    <header className="header">
      <div className="logo">🖨️ KABEEL PRINT</div>
      <a href="/admin" className="admin-link">لوحة الإدارة</a>
    </header>

    <section className="hero">
      <div>
        <span className="badge">خدمة طباعة أونلاين</span>
        <h1>اطبع ملفاتك بسهولة وجودة عالية</h1>

        <p>ارفع الملف، اختر المواصفات، وسنجهز طلبك في أسرع وقت.</p>
        <a href="#order-form" className="hero-button">اطلب الطباعة الآن</a>
      </div>
    </section>

    <section className="features">
  <div className="feature-card">
    <div className="feature-icon">🖨️</div>
    <h3>طباعة احترافية</h3>
    <p>جودة عالية ووضوح ممتاز لكل ملفاتك</p>
  </div>

  <div className="feature-card">
    <div className="feature-icon">⚡</div>
    <h3>تنفيذ سريع</h3>
    <p>نجهز طلبك في أسرع وقت ممكن</p>
  </div>

  <div className="feature-card">
    <div className="feature-icon">📱</div>
    <h3>متابعة واتساب</h3>
    <p>طلبك يوصلنا مباشرة على واتساب</p>
  </div>
</section>

<section className="stats">
  <div>
    <strong>500+</strong>
    <span>ورقة مطبوعة</span>
  </div>

  <div>
    <strong>24h</strong>
    <span>تنفيذ سريع</span>
  </div>

  <div>
    <strong>100%</strong>
    <span>سهولة في الطلب</span>
  </div>
</section>

    <form id="order-form" className="order-card" onSubmit={handleSubmit}>
      <h2>طلب طباعة جديد</h2>

      <label>الاسم</label>
      <input
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      />

      <label>رقم الهاتف</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <label>ارفع الملف</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />

      <label>عدد النسخ</label>
      <input
        type="number"
        min="1"
        value={copies}
        onChange={(e) => setCopies(e.target.value)}
        required
      />

      <label>ألوان الطباعة</label>
      <select value={colorMode} onChange={(e) => setColorMode(e.target.value)}>
        <option>أبيض وأسود</option>
        <option>ألوان</option>
      </select>

      <label>طريقة الطباعة</label>
      <select value={printType} onChange={(e) => setPrintType(e.target.value)}>
        <option>وش فقط</option>
        <option>وش وظهر</option>
      </select>

      <label>حجم الورق</label>
      <select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
        <option>A4</option>
        <option>A3</option>
      </select>
      <label>طريقة الاستلام</label>

<select
  value={deliveryType}
  onChange={(e) => setDeliveryType(e.target.value)}
>
  <option value="استلام من المكتبة">
    استلام من المكتبة
  </option>

  <option value="توصيل للبيت">
    توصيل للبيت
  </option>
</select>

{deliveryType === "توصيل للبيت" && (
  <>
    <label>العنوان</label>

    <input
      type="text"
      placeholder="اكتب عنوانك بالتفصيل"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  </>
)}

      <button type="submit" disabled={loading}>
        {loading ? "جاري إرسال الطلب..." : "إرسال الطلب"}
      </button>

      {message && <h3 className="message">{message}</h3>}
    </form>
  </div>
);
}

export default App;