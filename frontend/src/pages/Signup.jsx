import { useState } from "react";
import axios from "axios";

function Signup() {

  const [form, setForm] = useState({
    name:"",
    email:"",
    password:""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {

    try {

      const res = await axios.post(
        "https://civic-dashboard-vicc.onrender.com/signup",
        form
      );

      alert(res.data.message);

    } catch(err) {

      alert(err.response.data.error);

    }

  };

  return (
    <div>

      <h2>Signup</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>
        Signup
      </button>

    </div>
  );
}

export default Signup;