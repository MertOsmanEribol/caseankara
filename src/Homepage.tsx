import { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Users, FileText, X, Save } from "lucide-react";
import Header from "./components/Header";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  userId: number;
}

interface EditingUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface EditingPost {
  id: number;
  title: string;
  userId: number;
}

// LocalStorage ayarları
const saveUsersToLocal = (users: User[]) => {
  localStorage.setItem("yeni_kullanici", JSON.stringify(users));
};

const savePostsToLocal = (posts: Post[]) => {
  localStorage.setItem("yeni_post", JSON.stringify(posts));
};

const loadUsersFromLocal = (): User[] => {
  const data = localStorage.getItem("yeni_kullanici");
  return data ? JSON.parse(data) : [];
};

const loadPostsFromLocal = (): Post[] => {
  const data = localStorage.getItem("yeni_post");
  return data ? JSON.parse(data) : [];
};

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [editingPost, setEditingPost] = useState<EditingPost | null>(null);

  const [newUser, setNewUser] = useState({ name: "", username: "", email: "" });
  const [newPost, setNewPost] = useState({ title: "", userId: "" });

  useEffect(() => {
    Promise.all([
      fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json()
      ),
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
    ]).then(([apiUsers, apiPosts]: [User[], Post[]]) => {
      const localUsers = loadUsersFromLocal();
      const localPosts = loadPostsFromLocal();

      setUsers([...apiUsers, ...localUsers]);
      setPosts([...apiPosts, ...localPosts]);
    });
  }, []);

  const getPostCount = (userId: number) =>
    posts.filter((p) => p.userId === userId).length;

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "bilinmeyen";
  };

  // Kullanıcılar Crud
  const addUser = () => {
    if (!newUser.name.trim() || !newUser.username.trim() || !newUser.email.trim())
      return;
    const newId = Math.max(...users.map((u) => u.id), 0) + 1;
    const user: User = { id: newId, ...newUser };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);

    const customUsers = loadUsersFromLocal();
    saveUsersToLocal([...customUsers, user]);

    setNewUser({ name: "", username: "", email: "" });
  };

  const deleteUser = (id: number) => {
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);

    const customUsers = loadUsersFromLocal().filter((u) => u.id !== id);
    saveUsersToLocal(customUsers);

    setPosts(posts.filter((p) => p.userId !== id));
  };

  const startEditingUser = (user: User) => {
    setEditingUser({ ...user });
  };

  const saveUserEdit = () => {
    if (!editingUser) return;
    const updatedUsers = users.map((u) =>
      u.id === editingUser.id ? editingUser : u
    );
    setUsers(updatedUsers);

    const customUsers = loadUsersFromLocal().map((u) =>
      u.id === editingUser.id ? editingUser : u
    );
    saveUsersToLocal(customUsers);

    setEditingUser(null);
  };

  const cancelUserEdit = () => {
    setEditingUser(null);
  };

  // Postlar Crud 
  const addPost = () => {
    if (!newPost.title.trim() || !newPost.userId.trim()) return;
    const newId = Math.max(...posts.map((p) => p.id), 0) + 1;
    const post: Post = {
      id: newId,
      title: newPost.title,
      userId: +newPost.userId,
    };

    const updatedPosts = [...posts, post];
    setPosts(updatedPosts);

    const customPosts = loadPostsFromLocal();
    savePostsToLocal([...customPosts, post]);

    setNewPost({ title: "", userId: "" });
  };

  const deletePost = (id: number) => {
    const updatedPosts = posts.filter((p) => p.id !== id);
    setPosts(updatedPosts);

    const customPosts = loadPostsFromLocal().filter((p) => p.id !== id);
    savePostsToLocal(customPosts);
  };

  const startEditingPost = (post: Post) => {
    setEditingPost({ ...post });
  };

  const savePostEdit = () => {
    if (!editingPost) return;
    const updatedPosts = posts.map((p) =>
      p.id === editingPost.id ? editingPost : p
    );
    setPosts(updatedPosts);

    const customPosts = loadPostsFromLocal().map((p) =>
      p.id === editingPost.id ? editingPost : p
    );
    savePostsToLocal(customPosts);

    setEditingPost(null);
  };

  const cancelPostEdit = () => {
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Props ile kullanıcı ve post sayısı gönderiliyor */}
      <Header userCount={users.length} postCount={posts.length} />

      {/* Ana içerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-4 px-6 cursor-pointer rounded-2xl font-semibold text-center transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === "users"
                  ? "bg-blue-600 text-white border-b-4 border-blue-700"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <Users size={20} />
              <span>Kullanıcılar ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-4 px-6 cursor-pointer rounded-2xl font-semibold text-center transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === "posts"
                  ? "bg-blue-600 text-white border-b-4 border-blue-700"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <FileText size={20} />
              <span>Tüm Postlar ({posts.length})</span>
            </button>
          </div>
        </div>

        {/* Kullanıcılar sekme */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Add User Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="mr-2" size={20} />
                Yeni Kullanıcı Ekle
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Tam isim"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Kullanıcı adı"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                />
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                <button
                  onClick={addUser}
                  className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center font-medium"
                >
                  <Plus size={16} className="mr-2" />
                  Kullanıcıyı Ekle
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İsim
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı Adı
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Postlar
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eylemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{user.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        @{user.username}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getPostCount(user.id)} post
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <button
                          onClick={() => startEditingUser(user)}
                          className="text-blue-600 cursor-pointer hover:text-blue-900 transition-colors duration-150 p-2 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer transition-colors duration-150 p-2 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Post sekmesi */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            {/* Add Post Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="mr-2" size={20} />
                Yeni Post Ekle
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  placeholder="Post İçeriği"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                />
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  value={newPost.userId}
                  onChange={(e) =>
                    setNewPost({ ...newPost, userId: e.target.value })
                  }
                >
                  <option value="">Kullanıcı Seçin</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addPost}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center font-medium"
                >
                  <Plus size={16} className="mr-2" />
                  Yeni Post paylaş
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başlık
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eylemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{post.id}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 max-w-xs md:max-w-md">
                        <div className="truncate" title={post.title}>
                          {post.title}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-xs font-medium text-blue-600">
                              {getUserName(post.userId).charAt(0)}
                            </span>
                          </div>
                          {getUserName(post.userId)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                        <button
                          onClick={() => startEditingPost(post)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer transition-colors duration-150 p-2 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer transition-colors duration-150 p-2 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Kullanıcı Modalı */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Kullanıcıyı Güncelle
                </h2>
                <button
                  onClick={cancelUserEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                />
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                />
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={cancelUserEdit}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={saveUserEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Değişiklikleri kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post modalı */}
        {editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Post Güncelleme
                </h2>
                <button
                  onClick={cancelPostEdit}
                  className="text-gray-400 cursor-pointer hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                />
                <select
                  className="border border-gray-300 cursor-pointer rounded-lg px-4 py-2 w-full"
                  value={editingPost.userId}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      userId: parseInt(e.target.value),
                    })
                  }
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={cancelPostEdit}
                  className="px-4 py-2 border cursor-pointer rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={savePostEdit}
                  className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Değişiklikleri Kaydet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;