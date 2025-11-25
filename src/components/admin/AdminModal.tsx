"use client";
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  TechCard,
  TechButton,
  TechInput,
  GlitchText,
  TechBadge,
  NeonBorder,
  DataStream,
  HackerText,
} from "@/components/ui/tech";
import { Shield, X, Save, RefreshCw, Lock, Settings, Zap, Ban } from "lucide-react";
import toast from "react-hot-toast";

interface UploadConfig {
  maxUploadsPerMinute: number;
  maxUploadsPerHour: number;
  maxFileSize: number;
  cooldownAfterLimit: number;
  blockedExtensions: string[];
}

// ============ LOGIN MODAL ============
interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setPassword("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    setIsLoading(true);
    try {
      // Verify password by calling API
      const configRes = await fetch("/api/admin/config");
      const config = await configRes.json();
      
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, config }),
      });
      
      if (res.ok) {
        toast.success("Đăng nhập thành công!");
        onSuccess(password);
        onClose();
      } else {
        toast.error("Mật khẩu không đúng");
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <DataStream color="#00ff88" density={8} speed={40} className="opacity-10" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <TechCard className="p-0 overflow-hidden" corners glow>
          <div className="relative border-b border-border p-4 bg-gradient-to-r from-[#00ff88]/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#00ff88] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <HackerText className="text-lg font-bold" color="#00ff88">ADMIN_ACCESS</HackerText>
                  <p className="text-[10px] text-muted-foreground font-mono">AUTHENTICATION</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-foreground/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#00ff88] flex items-center justify-center relative">
                <Lock className="w-7 h-7 text-[#00ff88]" />
                <div className="absolute inset-0 border border-[#00ff88] animate-ping opacity-20" />
              </div>
              <GlitchText className="text-lg font-bold mb-1" intensity="low">ENTER_PASSWORD</GlitchText>
              <p className="text-xs text-muted-foreground font-mono">Nhập mật khẩu admin để tiếp tục</p>
            </div>

            <TechInput
              type="password"
              label="ADMIN_PASSWORD"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              accentColor="#00ff88"
            />

            <NeonBorder color="#00ff88" intensity="medium" animated>
              <TechButton type="submit" variant="primary" className="w-full py-4" loading={isLoading} icon={<Shield className="w-4 h-4" />}>
                AUTHENTICATE
              </TechButton>
            </NeonBorder>
          </form>
        </TechCard>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};


// ============ CONFIG MODAL ============
interface AdminConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminPassword: string;
}

export const AdminConfigModal: React.FC<AdminConfigModalProps> = ({ isOpen, onClose, adminPassword }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<UploadConfig>({
    maxUploadsPerMinute: 5,
    maxUploadsPerHour: 30,
    maxFileSize: 50,
    cooldownAfterLimit: 60,
    blockedExtensions: [],
  });
  const [blockedText, setBlockedText] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/config");
      const data = await res.json();
      setConfig(data);
      setBlockedText(data.blockedExtensions?.join("\n") || "");
    } catch {
      toast.error("Không thể tải cấu hình");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, fetchConfig]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedConfig = {
        ...config,
        blockedExtensions: blockedText.split("\n").filter((x) => x.trim()),
      };
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword, config: updatedConfig }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Lỗi khi lưu");
        return;
      }

      setConfig(updatedConfig);
      toast.success("Đã lưu cấu hình!");
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <DataStream color="#00ff88" density={8} speed={40} className="opacity-10" />
      </div>

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <TechCard className="p-0 overflow-hidden" corners glow>
          {/* Header */}
          <div className="relative border-b border-border p-4 bg-gradient-to-r from-[#00ff88]/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-[#00ff88] flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#00ff88]" />
                </div>
                <div>
                  <HackerText className="text-lg font-bold" color="#00ff88">RATE_LIMIT_CONFIG</HackerText>
                  <p className="text-[10px] text-muted-foreground font-mono">UPLOAD_SETTINGS</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TechBadge variant="success" size="sm" pulse>ADMIN</TechBadge>
                <button onClick={onClose} className="p-2 hover:bg-foreground/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Rate Limit Section */}
            <div className="border border-border p-4 relative">
              <div className="absolute -top-3 left-4 bg-background px-2">
                <span className="text-xs font-mono text-[#00ff88] flex items-center gap-1">
                  <Zap className="w-3 h-3" /> RATE_LIMIT
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <TechInput
                  type="number"
                  label="MAX_UPLOADS/MIN"
                  value={config.maxUploadsPerMinute}
                  onChange={(e) => setConfig({ ...config, maxUploadsPerMinute: Number(e.target.value) })}
                  accentColor="#00ff88"
                />
                <TechInput
                  type="number"
                  label="MAX_UPLOADS/HOUR"
                  value={config.maxUploadsPerHour}
                  onChange={(e) => setConfig({ ...config, maxUploadsPerHour: Number(e.target.value) })}
                  accentColor="#00ff88"
                />
                <TechInput
                  type="number"
                  label="MAX_FILE_SIZE (MB)"
                  value={config.maxFileSize}
                  onChange={(e) => setConfig({ ...config, maxFileSize: Number(e.target.value) })}
                  accentColor="#00ff88"
                />
                <TechInput
                  type="number"
                  label="COOLDOWN (SEC)"
                  value={config.cooldownAfterLimit}
                  onChange={(e) => setConfig({ ...config, cooldownAfterLimit: Number(e.target.value) })}
                  accentColor="#00ff88"
                />
              </div>
            </div>

            {/* Blocked Extensions Section */}
            <div className="border border-border p-4 relative">
              <div className="absolute -top-3 left-4 bg-background px-2">
                <span className="text-xs font-mono text-red-500 flex items-center gap-1">
                  <Ban className="w-3 h-3" /> BLOCKED_EXTENSIONS
                </span>
              </div>
              <div className="mt-2">
                <label className="block text-[10px] font-mono text-muted-foreground mb-2">
                  MỖI EXTENSION MỘT DÒNG (VD: .exe)
                </label>
                <textarea
                  rows={4}
                  value={blockedText}
                  onChange={(e) => setBlockedText(e.target.value)}
                  placeholder=".exe&#10;.bat&#10;.cmd"
                  className="w-full bg-transparent border border-border px-4 py-3 text-sm font-mono outline-none transition-colors focus:border-red-500 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <TechButton variant="secondary" className="flex-1" onClick={fetchConfig} icon={<RefreshCw className="w-4 h-4" />}>
                REFRESH
              </TechButton>
              <NeonBorder color="#00ff88" intensity="medium" animated className="flex-1">
                <TechButton variant="primary" className="w-full py-3" onClick={handleSave} loading={isLoading} icon={<Save className="w-4 h-4" />}>
                  SAVE_CONFIG
                </TechButton>
              </NeonBorder>
            </div>
          </div>
        </TechCard>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AdminLoginModal;
