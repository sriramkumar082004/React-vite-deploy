import { useState } from "react";
import { api } from "../api";


export default function ItemForm() {
const [name, setName] = useState("");
const [description, setDescription] = useState("");


const handleSubmit = async (e) => {
e.preventDefault();
await api.post("/items", { name, description });
setName("");
setDescription("");
alert("Item Added!");
};


return (
<form onSubmit={handleSubmit}>
<input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
<input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
<button type="submit">Save</button>
</form>
);
}