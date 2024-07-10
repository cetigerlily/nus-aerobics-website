import NavBar from "../components/dashboard/NavBar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <NavBar />
      </div>
      <div className="w-full h-screen p-10 bg-[#FCF0F250] gap-y-5 md:overflow-y-auto">{children}</div>
    </div>
  );
}
