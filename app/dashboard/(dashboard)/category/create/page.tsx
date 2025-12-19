// app/dashboard/blog/categories/create/page.tsx  (or wherever)
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { toast } from "sonner";
import { createCategory } from "@/app/actions/dashboard/category/category-actions"; // Your server action
import { categorySchema, type CategoryFormValues } from "@/lib/validation";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Setup RHF with Zod validation
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Submit handler
  function onSubmit(values: CategoryFormValues) {
    startTransition(async () => {
      try {
        await createCategory(values); // Server Action runs on server
        toast.success("Category created!");
        router.push("/dashboard/category");
        router.refresh(); // Re-fetch data if needed
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create");
      }
    });
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Technology" {...field} />
                  </FormControl>
                  <FormMessage /> {/* Auto shows Zod errors */}
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}