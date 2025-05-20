import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil, Trash2, Plus } from 'lucide-react'

const dummyAlbums = [
  {
    id: '1',
    album_name: 'Lover',
    artist_name: 'Taylor Swift',
    cover_img: 'https://link-to-album-cover.com/lover.jpg',
    release_date: '2019-08-23',
    total_tracks: 18,
  },
  {
    id: '2',
    album_name: 'Divide',
    artist_name: 'Ed Sheeran',
    cover_img: 'https://link-to-album-cover.com/divide.jpg',
    release_date: '2017-03-03',
    total_tracks: 16,
  },
]

function ManageAlbums() {
  const [albums, setAlbums] = useState([])
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState('') // để preview ảnh
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  // Lấy file ảnh bìa từ form để tạo preview khi thay đổi
  const coverFile = watch('cover_img')

  useEffect(() => {
    setAlbums(dummyAlbums)
  }, [])

  // Tạo URL preview mỗi khi file thay đổi
  useEffect(() => {
    if (coverFile && coverFile.length > 0) {
      const file = coverFile[0]
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      return () => URL.revokeObjectURL(objectUrl) // dọn dẹp URL cũ
    } else {
      setPreview('')
    }
  }, [coverFile])

  const onSubmit = (data) => {
    // Lấy file ảnh bìa, giả sử bạn muốn lưu URL tạo từ file
    const file = data.cover_img[0]
    const newAlbum = {
      id: Date.now().toString(),
      album_name: data.album_name,
      artist_name: data.artist_name,
      // Tạm thời lưu preview URL cho demo
      cover_img: preview || '', 
      release_date: data.release_date,
      total_tracks: Number(data.total_tracks),
    }

    setAlbums(prev => [...prev, newAlbum])
    reset()
    setPreview('')
  }

  const filteredAlbums = albums.filter(album =>
    album.album_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý Albums</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Thêm Album
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm Album Mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4">
                <Label className="w-32">Tên Album</Label>
                <div className="flex-1">
                  <Input
                    {...register('album_name', { required: 'Tên album là bắt buộc' })}
                  />
                  {errors.album_name && (
                    <p className="text-sm text-red-500">{errors.album_name.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-32">Tên Nghệ Sĩ</Label>
                <div className="flex-1">
                  <Input
                    {...register('artist_name', { required: 'Tên nghệ sĩ là bắt buộc' })}
                  />
                  {errors.artist_name && (
                    <p className="text-sm text-red-500">{errors.artist_name.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <Label className="w-32">Ảnh Bìa</Label>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button type="button" onClick={() => fileInputRef.current?.click()}>
                        Chọn ảnh...
                      </Button>
                      {coverFile?.[0] && (
                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                          {coverFile[0].name}
                        </span>
                      )}
                    </div>

                    {/* input thật bị ẩn */}
                    <input
                      type="file"
                      accept="image/*"
                      {...register('cover_img', { required: 'Ảnh bìa là bắt buộc' })}
                      ref={(e) => {
                        register('cover_img').ref(e)
                        fileInputRef.current = e
                      }}
                      className="hidden"
                    />
                    {errors.cover_img && (
                      <p className="text-sm text-red-500">{errors.cover_img.message}</p>
                    )}
                  </div>
              </div>

              {preview && (
                <div className="flex flex-col gap-2">
                  <Label>Preview Ảnh Bìa:</Label>
                  <div className="w-full h-48 overflow-hidden border rounded-md flex items-center justify-center bg-gray-100">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <Label className="w-32">Ngày Phát Hành</Label>
                <div className="flex-1">
                  <Input
                    type="date"
                    {...register('release_date', { required: 'Ngày phát hành là bắt buộc' })}
                  />
                  {errors.release_date && (
                    <p className="text-sm text-red-500">{errors.release_date.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label className="w-32">Số Bài Hát</Label>
                <div className="flex-1">
                  <Input
                    type="number"
                    {...register('total_tracks', {
                      required: 'Số bài hát là bắt buộc',
                      valueAsNumber: true,
                      min: { value: 1, message: 'Số bài hát phải lớn hơn 0' },
                    })}
                  />
                  {errors.total_tracks && (
                    <p className="text-sm text-red-500">{errors.total_tracks.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Lưu Album
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Input
        placeholder="Tìm kiếm album..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAlbums.map(album => (
          <Card key={album.id} className="rounded-2xl shadow-md">
            <img
              src={album.cover_img}
              alt={album.album_name}
              className="w-full h-48 rounded-t-2xl  object-contain"
            />
            <CardContent className="p-4 space-y-2">
              <h2 className="text-lg font-semibold">{album.album_name}</h2>
              <p className="text-sm text-gray-500">Nghệ sĩ: {album.artist_name}</p>
              <p className="text-sm text-gray-500">Phát hành: {album.release_date}</p>
              <p className="text-sm text-gray-500">Số bài hát: {album.total_tracks}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <Pencil size={14} /> Sửa
                </Button>
                <Button size="sm" variant="destructive" className="flex items-center gap-1">
                  <Trash2 size={14} /> Xoá
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ManageAlbums
