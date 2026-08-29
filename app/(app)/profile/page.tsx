"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  CheckCircle2,
  X,
} from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const {
    currentUser,
    loading,
    error,
    verifyPassword,
  } = useAuthStore();

  const [changePass, setChangePass] = useState(false);

  const [prevPass, setPrevPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showPrevPass, setShowPrevPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChangePassword = () => {
    setFormError("");
    setSuccess(false);

    if (!currentUser) {
      return;
    }

    if (!prevPass || !newPass || !confirmPass) {
      setFormError("Please fill in all password fields.");
      return;
    }

    if (!verifyPassword(prevPass)) {
      setFormError("Your current password is incorrect.");
      return;
    }

    if (newPass.length < 6) {
      setFormError(
        "Your new password must be at least 6 characters."
      );
      return;
    }

    if (newPass !== confirmPass) {
      setFormError("New passwords do not match.");
      return;
    }

    setSuccess(true);

    setPrevPass("");
    setNewPass("");
    setConfirmPass("");
  };

  const handleCancel = () => {
    setChangePass(false);

    setPrevPass("");
    setNewPass("");
    setConfirmPass("");

    setFormError("");
    setSuccess(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Spinner className="size-8 text-slate-500" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account and security settings.
        </p>
      </div>

      {/* Profile card */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage
                src={currentUser.image}
                alt={currentUser.username}
              />

              <AvatarFallback className="bg-slate-900 text-lg font-semibold uppercase text-white">
                {currentUser.username?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {currentUser.username}
              </h2>

              <p className="text-sm text-slate-500">
                Personal Finance Account
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Account Information
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your basic account details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <UserRound className="h-4 w-4" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Username
                  </span>
                </div>

                <p className="font-medium text-slate-900">
                  {currentUser.username}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <LockKeyhole className="h-4 w-4" />

                  <span className="text-xs font-medium uppercase tracking-wide">
                    Password
                  </span>
                </div>

                <p className="font-medium tracking-widest text-slate-900">
                  ••••••
                </p>
              </div>
            </div>
          </div>

          <div className="my-8 h-px bg-slate-100" />

          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Password
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Update your password to keep your account secure.
                </p>
              </div>

              {!changePass && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setChangePass(true);
                    setSuccess(false);
                  }}
                >
                  Change Password
                </Button>
              )}
            </div>

            {changePass && (
              <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                <div className="space-y-2">
                  <Label htmlFor="current-password">
                    Current password
                  </Label>

                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPrevPass ? "text" : "password"}
                      placeholder="Enter your current password"
                      value={prevPass}
                      onChange={(e) =>
                        setPrevPass(e.target.value)
                      }
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPrevPass((value) => !value)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700"
                    >
                      {showPrevPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">
                    New password
                  </Label>

                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPass ? "text" : "password"}
                      placeholder="Enter a new password"
                      value={newPass}
                      onChange={(e) =>
                        setNewPass(e.target.value)
                      }
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPass((value) => !value)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700"
                    >
                      {showNewPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">
                    Use at least 6 characters.
                  </p>
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    Confirm new password
                  </Label>

                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={
                        showConfirmPass ? "text" : "password"
                      }
                      placeholder="Confirm your new password"
                      value={confirmPass}
                      onChange={(e) =>
                        setConfirmPass(e.target.value)
                      }
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPass((value) => !value)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {(formError || error) && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    {formError || error}
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />

                    Password validated successfully.
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={handleChangePassword}
                  >
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Save Password
                  </Button>
                </div>
              </div>
            )}

            {!changePass && (
              <p className="text-xs text-slate-400">
                Password changes are currently simulated for this
                demo.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
