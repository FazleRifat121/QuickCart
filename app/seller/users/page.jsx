"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UsersAdmin = () => {
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");

	const fetchUsers = async () => {
		try {
			const res = await axios.get("/api/admin/users");
			if (res.data.success) setUsers(res.data.users);
		} catch (err) {
			toast.error(err.response?.data?.message || err.message);
		}
	};

	const toggleRole = async (userId, currentRole) => {
		const newRole = currentRole === "seller" ? "normal" : "seller";
		try {
			const res = await axios.patch("/api/admin/users", {
				userId,
				role: newRole,
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

	const toggleBan = async (userId, isBanned) => {
		try {
			const res = await axios.patch("/api/admin/users/ban", {
				userId,
				ban: !isBanned,
			});
			if (res.data.success) {
				setUsers((prev) =>
					prev.map((u) =>
						u._id === userId ? { ...u, banned: res.data.user.banned } : u
					)
				);
				toast.success(
					`${res.data.user.name} has been ${
						res.data.user.banned ? "banned" : "unbanned"
					}`
				);
			}
		} catch (err) {
			toast.error(err.response?.data?.message || err.message);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const filteredUsers = users.filter(
		(u) =>
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div className="md:p-6 p-4">
			<h1 className="text-2xl font-bold mb-4">Users Management</h1>

			{/* Search */}
			<div className="mb-4">
				<input
					type="text"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search by name or email..."
					className="w-full md:w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
				/>
			</div>

			{filteredUsers.length === 0 ? (
				<p className="text-center mt-10">No users found</p>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border border-gray-300 min-w-[600px]">
						<thead className="hidden sm:table-header-group">
							<tr className="bg-gray-100">
								<th className="p-2 border">Name</th>
								<th className="p-2 border">Email</th>
								<th className="p-2 border">Role</th>
								<th className="p-2 border">Banned</th>
								<th className="p-2 border">Actions</th>
							</tr>
						</thead>
						<tbody className="flex flex-col sm:table-row-group">
							{filteredUsers.map((user) => (
								<tr
									key={user._id}
									className="border-b border-gray-200 sm:border-none flex flex-col sm:table-row mb-4 sm:mb-0"
								>
									<td className="p-2 sm:px-4 sm:py-2">
										<span className="font-semibold sm:hidden">Name: </span>
										{user.name}
									</td>
									<td className="p-2 sm:px-4 sm:py-2">
										<span className="font-semibold sm:hidden">Email: </span>
										{user.email}
									</td>
									<td className="p-2 sm:px-4 sm:py-2">
										<span className="font-semibold sm:hidden">Role: </span>
										{user.role}
									</td>
									<td className="p-2 sm:px-4 sm:py-2">
										<span className="font-semibold sm:hidden">Banned: </span>
										{user.banned ? "Yes" : "No"}
									</td>
									<td className="p-2 sm:px-4 sm:py-2 flex flex-col sm:flex-row gap-2">
										<button
											onClick={() => toggleRole(user._id, user.role)}
											className="px-3 py-1 w-full sm:w-auto bg-blue-600 text-white rounded hover:bg-blue-700"
										>
											{user.role === "seller" ? "Revoke Seller" : "Make Seller"}
										</button>
										<button
											onClick={() => toggleBan(user._id, user.banned)}
											className="px-3 py-1 w-full sm:w-auto bg-red-600 text-white rounded hover:bg-red-700"
										>
											{user.banned ? "Unban" : "Ban"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default UsersAdmin;
