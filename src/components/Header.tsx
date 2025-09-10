import { Users, FileText } from "lucide-react";

interface HeaderProps {
  userCount: number;
  postCount: number;
}

const Header = ({ userCount, postCount }: HeaderProps) => {
  return (
    <header className="relative bg-gradient-to-r shadow-2xl shadow-sky-950 from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"></div>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
                Kullanıcı Yönetim
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text ml-2">
                  Kontrol Paneli
                </span>
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm font-medium flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                CRUD işlemleri ile güçlü kontrol sistemi
              </p>
            </div>
          </div>

          {/* User Post sayı kutuları*/}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:space-x-3 gap-3 sm:gap-0">
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 px-5 py-3 rounded-2xl cursor-pointer w-full sm:w-auto">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Toplam Kullanıcı</p>
                  <p className="text-2xl font-bold text-white">{userCount}</p>
                </div>
              </div>
            </div>
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 px-5 py-3 rounded-2xl cursor-pointer w-full sm:w-auto">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Toplam Post</p>
                  <p className="text-2xl font-bold text-white">{postCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </div>
    </header>
  );
};

export default Header;