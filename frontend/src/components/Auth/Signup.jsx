import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => { 
    const [formData, setFormData] = useState({ username: '', password: '' , email: "" }); 
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const data = await fetch('http://localhost:3000/api/register', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const response = await data.json();
            if (response.success) {
                toast.success("You have successfully register in!");
                navigate('/');
            } else{
                toast.error(response.errors[0].msg)
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 bg-image">
            <div className="bg-black bg-opacity-50 p-8 rounded shadow-md w-full max-w-sm">
                <h2 className="text-4xl text-white text-shadow-custom font-bold mb-6 text-center">Signup</h2>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white text-shadow-custom" htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            value={formData.username} 
                            onChange={onChange} 
                            placeholder="Username" 
                            required 
                            className="mt-1 block w-full px-3 py-2 border-none rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white text-shadow-custom" htmlFor="password">Email</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={formData.email} 
                            onChange={onChange} 
                            placeholder="Password" 
                            required 
                            className="mt-1 block w-full px-3 py-2 border-none rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white text-shadow-custom" htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={onChange} 
                            placeholder="Password" 
                            required 
                            className="mt-1 block w-full px-3 py-2 border-none rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full flex justify-center py-2 px-4 border-none outline-none rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
                    >
                        Signup
                    </button>
                    <p className="text-white">
                        If you already have an account, <Link to="/login" className="text-red-600 hover:text-red-700">Login</Link>.
                    </p>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Signup;
