import { motion } from "framer-motion";

type Props = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

export default function StatCard({ title, value, icon }: Props) {
  return (
    <motion.div
      className="card"
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