import { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDesc, setPlaylistDesc] = useState('');
  const [playlistImage, setPlaylistImage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);


  const navigate = useNavigate();


  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;
      setLoadingPlaylists(true);
      try {
        const res = await fetch(`http://localhost:4000/api/playlist/list`);
        const data = await res.json();
        if (data.success) {
          setPlaylists(data.playlists);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Error fetching playlists:', err);
      }
      setLoadingPlaylists(false);
    };

  fetchPlaylists();
}, [user]);


  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', playlistName);
      formData.append('desc', playlistDesc);
      formData.append('user', user._id);
      formData.append('image', playlistImage);
      const response = await fetch('http://localhost:4000/api/playlist/add', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message || 'Failed to create playlist');
      } else {
        setShowModal(false);
        setPlaylistName('');
        setPlaylistDesc('');
        setPlaylistImage(null);
        // Optionally: refresh playlist list here
        const res = await fetch(`http://localhost:4000/api/playlist/user/${user._id}`);
        const updatedData = await res.json();
        if (updatedData.success) {
          setPlaylists(updatedData.playlists);
        }
      }
    } catch (err) {
      setError('Network error');
    }
    setIsCreating(false);
  };

  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
      <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
        <div onClick={()=>navigate('/')} className='flex items-center gap-3 pl-8 cursor-pointer'>
            <img className='w-6' src={assets.home_icon} alt="" />
            <p className='font-bold'>Home</p>
        </div>
        <div className='flex items-center gap-3 pl-8 cursor-pointer'>
            <img className='w-6' src={assets.search_icon} alt="" />
            <p className='font-bold'>Search</p>
        </div>
      </div>
      <div className='bg-[#121212] h-[100%] rounded'>
        {/* Library + Create Playlist Icon */}
      <div className='bg-[#121212] h-[8%] rounded'>
        <div className='p-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <img className='w-8' src={assets.stack_icon} alt="Library" />
            <p className='font-semibold'>Your Library</p>
          </div>
          <div className='flex items-center gap-3'>
            <img className='w-5 cursor-pointer' src={assets.plus_icon} alt="Add" onClick={() => setShowModal(true)} />
          </div>
        </div>
      </div>

        {/** get all Playlist  */}
        <div className='overflow-y-auto px-2 pb-4'>
          {loadingPlaylists ? (
            <p className='text-gray-400 text-sm'>Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
              <h1>Create your first playlist</h1>
              <p className='font-light'>It's easy, we will help you</p>
              <button
                className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'
                onClick={() => setShowModal(true)}
              >
                Create Playlist
              </button>
            </div>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist._id}
                className='flex items-center gap-3 hover:bg-[#2a2a2a] rounded p-2 cursor-pointer'
                onClick={() => navigate(`/playlist/${playlist._id}`)}
              >
                <img
                  src={playlist.image || assets.default_playlist}
                  // alt={playlist.name}
                  className='w-10 h-10 rounded object-cover'
                />
                <div className='flex flex-col'>
                  <p className='font-semibold'>{playlist.name}</p>
                  <p className='text-sm text-gray-400 truncate w-32'>
                    {playlist.user?.username || 'Unknown'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {/* <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
            <h1>Create your first playlist</h1>
            <p className='font-light'>it's easy we will help you</p>
            <button
              className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'
              onClick={() => setShowModal(true)}
            >
              Create Playlist
            </button>
        </div> */}
        {/* <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4'>
            <h1>Let's findsome podcasts to follow</h1>
            <p className='font-light'>we'll keep you update on new episodes</p>
            <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Browse podcasts</button>
        </div> */}
      </div>
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md text-black'>
            <h2 className='text-xl font-bold mb-4 text-black'>Create Playlist</h2>
            {/*create playlist form*/}
            <form onSubmit={handleCreatePlaylist} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                <input
                  type='text'
                  value={playlistName}
                  onChange={e => setPlaylistName(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg text-black'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <input
                  type='text'
                  value={playlistDesc}
                  onChange={e => setPlaylistDesc(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Image</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={e => setPlaylistImage(e.target.files[0])}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                  required
                />
              </div>
              {error && <div className='text-red-600 text-sm'>{error}</div>}
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  className='px-4 py-2 bg-gray-300 rounded-lg text-black'
                  onClick={() => setShowModal(false)}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-green-600 rounded-lg text-white'
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/*Create seperator*/}
      {/*Create Model */}
    {/* Playlist List */}
        
  </div>
  )
}

export default Sidebar
