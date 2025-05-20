import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleRegister } from "@/services/authService";
import { uploadToCloudinary } from "../../../services/CloudUploadService/CloudService";

const userSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  dob: z
    .string()
    .min(1, "Ngày sinh là bắt buộc")
    .refine(
      (val) => {
        const dob = new Date(val);
        const now = new Date();
        const age = now.getFullYear() - dob.getFullYear();
        const m = now.getMonth() - dob.getMonth();
        const d = now.getDate() - dob.getDate();
        return age > 15 || (age === 15 && (m > 0 || (m === 0 && d >= 0)));
      },
      {
        message: "Người dùng phải lớn hơn 15 tuổi",
      }
    ),
  gender: z.enum(["Male", "Female"], {
    required_error: "Giới tính là bắt buộc",
  }),
  role: z.enum(["user", "admin"], {
    required_error: "Vai trò là bắt buộc",
  }),
  profile_pic: z.instanceof(File).optional(),
});

function ManageNewUser() {
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dob: "",
      gender: undefined,
      role: undefined,
      profile_pic: undefined,
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profile_pic", file, { shouldValidate: true });
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      // 1. Xử lý upload ảnh đại diện nếu có
      let profile_pic = null;
      if (data.profile_pic instanceof File) {
        try {
          // Hiển thị thông báo upload đang tiến hành
          const toastId = toast.loading("Đang tải lên ảnh đại diện...");

          profile_pic = await uploadToCloudinary(
            data.profile_pic,
            (progress) => {
              toast.update(toastId, {
                render: `Đang tải lên ảnh: ${Math.round(progress)}%`,
                type: "info",
                isLoading: true,
              });
            }
          );

          // Thêm URL ảnh vào dữ liệu gửi đi
          data.profile_pic = profile_pic;
          toast.dismiss(toastId);
        } catch (uploadError) {
          console.error("Upload ảnh lỗi:", uploadError);
          toast.error("Tải lên ảnh đại diện thất bại");
          return;
        }
      }
      console.log("data", data);
      const res = await handleRegister(data);
      console.log("res", res);
      if (res.message === "success") {
        toast.success("Tạo tài khoản thành công");
        reset();
        setPreviewAvatar(null);
      } else if (res.message === "email_exists") {
        toast.error("Email đã được đăng ký");
      } else if (res.message === "validation_error") {
        toast.error(
          "Dữ liệu không hợp lệ: " + Object.values(res.errors).join(", ")
        );
      } else {
        toast.error("Lỗi: " + (res.error || "Không thể tạo tài khoản"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi hệ thống");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Tạo tài khoản mới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            {/* Avatar Upload - Simple Version */}
            <div>
              <Label htmlFor="profile_pic">Ảnh đại diện</Label>
              <div className="flex items-center gap-4 mt-2">
                {previewAvatar && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                    <img
                      src={previewAvatar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="profile_pic"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ chấp nhận file ảnh (JPEG, PNG)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="name">Họ tên *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nhập họ tên"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Nhập email"
                className={errors.email ? "border-red-500" : ""}
                autoComplete="new-email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu *</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Nhập mật khẩu"
                className={errors.password ? "border-red-500" : ""}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dob">Ngày sinh *</Label>
              <Input
                id="dob"
                type="date"
                {...register("dob")}
                className={errors.dob ? "border-red-500" : ""}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.dob.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Giới tính *</Label>
              <Select
                onValueChange={(val) =>
                  setValue("gender", val, { shouldValidate: true })
                }
                value={watch("gender") || ""}
              >
                <SelectTrigger
                  className={errors.gender ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Nam</SelectItem>
                  <SelectItem value="Female">Nữ</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Vai trò *</Label>
              <Select
                onValueChange={(val) =>
                  setValue("role", val, { shouldValidate: true })
                }
                value={watch("role") || ""}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Người dùng</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Tạo tài khoản"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ManageNewUser;
