import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[30rem]">
        <h2 className="text-5xl font-medium text-center mb-5">GoalSphere</h2>
        <p className="text-lg text-center">
          Track your goals. Boost your productivity.
        </p>
         <div className="flex justify-center gap-4 mt-5">
          <Link to="/register">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition">
              Register
            </button>
          </Link>
          <Link to="/login">
            <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
