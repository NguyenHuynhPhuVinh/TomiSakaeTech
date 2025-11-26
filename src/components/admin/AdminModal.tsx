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
  RadarScan,
  TerminalText,
  LoadingDots,
} from "@/components/ui/tech";
import { Shield, X, Save, RefreshCw, Lock, Settings, Zap, Ban } from "lucide-react";
import { techToast } from "@/components/ui/tech";

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
        techToast.success("Đăng nhập thành công!");
        onSuccess(password);
        onClose();
      } else {
        techToast.error("Mật khẩu không đúng");
      }
    } catch {
      techToast.error("Lỗi kết nối");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <DataStream color="#00ff88" density={8} speed={40} className="opacity-10" />
      </div>

      <div className="relative w-full max-w-md animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
        <TechCard className="p-0 overflow-hidden relative" corners hover={false}>
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
              {/* Animated border */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#00ff88] to-transparent animate-[scan_1s_linear_infinite]" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#00ff88] to-transparent animate-[scan_1s_linear_infinite_reverse]" />
              </div>
              
              {/* Radar effect */}
              <div className="relative mb-6">
                <RadarScan size={100} color="#00ff88" speed={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-[#00ff88] animate-pulse" />
                </div>
              </div>

              {/* Progress text */}
              <div className="text-center space-y-3">
                <TerminalText color="#00ff88" prefix="$ " typingSpeed={50} showCursor>
                  sudo authenticate --admin
                </TerminalText>
                <div className="flex items-center gap-2 justify-center">
                  <LoadingDots color="#00ff88" size={6} />
                  <span className="text-[#00ff88]/80 font-mono text-xs">VERIFYING_CREDENTIALS...</span>
                </div>
              </div>

              {/* Fake progress steps */}
              <div className="mt-6 space-y-2 text-[10px] font-mono text-[#00ff88]/50">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00ff88] animate-pulse" />
                  <span>ENCRYPTING_CONNECTION</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00ff88]/50 animate-pulse" style={{ animationDelay: "0.2s" }} />
                  <span>VALIDATING_TOKEN</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00ff88]/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
                  <span>GRANTING_ACCESS</span>
                </div>
              </div>

              {/* Binary decoration */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[8px] font-mono text-[#00ff88]/20">
                  01000001 01000100 01001101 01001001 01001110
                </span>
              </div>
            </div>
          )}

          <div className="relative border-b border-border p-4 bg-linear-to-r from-[#00ff88]/10 to-transparent">
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
              <button onClick={onClose} disabled={isLoading} className="p-2 hover:bg-foreground/10 transition-colors disabled:opacity-30">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className={`p-6 space-y-6 ${isLoading ? "opacity-0" : ""}`}>
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
              disabled={isLoading}
            />

            <NeonBorder color="#00ff88" intensity="medium" animated>
              <TechButton type="submit" variant="primary" className="w-full py-4" disabled={isLoading} icon={<Shield className="w-4 h-4" />}>
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
      techToast.error("Không thể tải cấu hình");
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
        techToast.error(data.error || "Lỗi khi lưu");
        return;
      }

      setConfig(updatedConfig);
      techToast.success("Đã lưu cấu hình!");
    } catch {
      techToast.error("Lỗi kết nối server");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <DataStream color="#00ff88" density={8} speed={40} className="opacity-10" />
      </div>

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
        <TechCard className="p-0 overflow-hidden" corners hover={false}>
          {/* Header */}
          <div className="relative border-b border-border p-4 bg-linear-to-r from-[#00ff88]/10 to-transparent">
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
                  className="w-full bg-transparent border border-border px-4 py-3 text-sm font-mono outline-hidden transition-colors focus:border-red-500 resize-none"
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
