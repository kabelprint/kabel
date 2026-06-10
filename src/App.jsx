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
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [deliveryType, setDeliveryType] = useState("استلام من المكتبة");
const [address, setAddress] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const whatsappWindow = window.open("", "_blank");
    setLoading(true);
    setMessage("جاري رفع الملفات، برجاء الانتظار...");
    

    let fileUrls = [];

    if (files.length > 0) {
     for (const file of files) {
  const extension = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("order - files")
    .upload(fileName, file);

  if (uploadError) {
    console.log(uploadError);
    setMessage("حدث خطأ أثناء رفع أحد الملفات");
    setLoading(false);
    return;
  }

  const { data } = supabase.storage
    .from("order-files")
    .getPublicUrl(fileName);

  fileUrls.push(data.publicUrl);
}
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
      file_url: fileUrls.join("\n"),
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
  "روابط الملفات: " + fileUrls.join("%0A");

const whatsappWindow = window.open("", "_blank");

const whatsappUrl =
  "https://wa.me/" + whatsappNumber + "?text=" + whatsappText;

if (whatsappWindow) {
  whatsappWindow.location.href = whatsappUrl;
} else {
  window.location.href = whatsappUrl;
}


      setCustomerName("");
      setPhone("");
      setCopies(1);
      setFiles([]);
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

        <p> مع مكتبة قابيل سنجهز طلبك في أسرع وقت.

        </p>
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
    <p>تجهيز طلبك في أسرع وقت ممكن</p>
  </div>

  <a
    href="https://wa.me/201095042810"
    target="_blank"
    rel="noreferrer"
    className="feature-card whatsapp-card"
  >
    <div className="feature-icon">📱</div>
    <h3>متابعة واتساب</h3>
    <p>اضغط هنا للتواصل معنا مباشرة</p>
  </a>

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
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
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