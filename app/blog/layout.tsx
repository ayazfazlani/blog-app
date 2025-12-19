
import { getCategories } from "../actions/dashboard/category/category-actions";
import CategorySidebar from "./components/sidebar";

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}

          <CategorySidebar categories={categories} />
          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}