import { motion } from "framer-motion";

type AccentType =
  | "accent-blue"
  | "accent-red"
  | "accent-amber"
  | "accent-green";

type Props = {
  title: string;
  value: number;
  icon: React.ReactNode;
  accent?: AccentType; // ✅ use proper type
};

export default function StatCard({ title, value, icon, accent }: Props) {
  return (
    <motion.div
      className={`card ${accent || ""}`} // ✅ APPLY accent here
      whileHover={{ scale: 1.03 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon}
        <h3>{title}</h3>
      </div>
      <h1>{value}</h1>
    </motion.div>
  );
}