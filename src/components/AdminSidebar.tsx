
import { Home, Package, Plus, BarChart3, Settings, ReceiptText } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface AdminSidebarProps {
  active: string;
  onChange: (tab: string) => void;
}

const menu = [
  { label: "Overview", icon: Home, tab: "overview" },
  { label: "Orders", icon: ReceiptText, tab: "orders" },
  { label: "Products", icon: Package, tab: "products" },
  { label: "Add Product", icon: Plus, tab: "add-product" },
  { label: "Reports", icon: BarChart3, tab: "reports" },
  { label: "Settings", icon: Settings, tab: "settings" },
];

export default function AdminSidebar({ active, onChange }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menu.map((item) => (
              <SidebarMenuItem key={item.tab}>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => onChange(item.tab)}
                    className={`flex items-center w-full gap-2 px-3 py-2 text-left rounded ${
                      active === item.tab ? "bg-accent text-foreground font-bold" : ""
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
