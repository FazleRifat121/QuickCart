"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UsersAdmin = () => {
	const [users, setUsers] = useState([]);

	const fetchUsers = async () => {
		try {
			const res = await axios.get("/api/admin/users");
			if (res.data.success) setUsers(res.data.users);
		} catch (err) {
			toast.error(err.response?.data?.message || err.message);
		}
	};

	const toggleRole = async (userId, currentRole) => {
		const newRole = currentRole === "seller" ? "normal" : "seller"; // lowercase
		try {
			const res = await axios.patch("/api/admin/users", {
				userId,
				role: newRole, // send correct enum value
			});

			if (res.data.success) {
				setUsers((prev) =>
					prev.map((u) =>
						u._id === userId ? { ...u, role: res.data.user.role } : u
					)
				);
				toast.success(`${res.data.user.name} is now ${res.data.user.role}`);
			}
		} catch (err) {
			toast.error(err.response?.data?.message || err.message);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Users Management</h1>
			{users.length === 0 ? (
				<p className="text-gray-500">No users found</p>
			) : (
				<table className="min-w-full border border-gray-300">
					<thead>
						<tr className="bg-gray-100">
							<th className="p-2 border">Name</th>
							<th className="p-2 border">Email</th>
							<th className="p-2 border">Role</th>
							<th className="p-2 border">Action</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user._id} className="text-center">
								<td className="p-2 border">{user.name}</td>
								<td className="p-2 border">{user.email}</td>
								<td className="p-2 border">{user.role}</td>
								<td className="p-2 border">
									<button
										onClick={() => toggleRole(user._id, user.role)}
										className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
									>
										{user.role === "seller" ? "Revoke Seller" : "Make Seller"}
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default UsersAdmin;
