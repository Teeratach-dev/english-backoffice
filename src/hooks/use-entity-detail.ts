"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseEntityDetailConfig<TForm> {
  apiPath: string;
  entityId: string;
  formDefaults: TForm;
  redirectPath: string;
  entityLabel: string;
  includeChildren?: boolean;
  mapData?: (data: any) => { form: TForm; children?: any[]; raw: any };
}

interface UseEntityDetailReturn<TForm> {
  entity: any;
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  children: any[];
  setChildren: React.Dispatch<React.SetStateAction<any[]>>;
  loading: boolean;
  saving: boolean;
  save: () => Promise<void>;
  remove: () => Promise<void>;
  fetchData: () => Promise<void>;
}

export function useEntityDetail<TForm>({
  apiPath,
  entityId,
  formDefaults,
  redirectPath,
  entityLabel,
  includeChildren = true,
  mapData,
}: UseEntityDetailConfig<TForm>): UseEntityDetailReturn<TForm> {
  const router = useRouter();
  const [entity, setEntity] = useState<any>(null);
  const [form, setForm] = useState<TForm>(formDefaults);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      const query = includeChildren ? "?include=children" : "";
      const res = await fetch(`${apiPath}/${entityId}${query}`);
      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setEntity(data);

      if (mapData) {
        const mapped = mapData(data);
        setForm(mapped.form);
        if (mapped.children) setChildren(mapped.children);
      } else {
        setChildren(data.children || []);
      }
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`${apiPath}/${entityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Failed to save ${entityLabel}`);

      toast.success(`${entityLabel} updated successfully`);
      router.push(redirectPath);
    } catch (error) {
      toast.error(`Error saving ${entityLabel}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (
      !confirm(
        `Are you sure you want to delete this ${entityLabel.toLowerCase()}? This will also delete all items within it.`,
      )
    )
      return;

    try {
      const res = await fetch(`${apiPath}/${entityId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete ${entityLabel}`);

      toast.success(`${entityLabel} deleted successfully`);
      router.push(redirectPath);
    } catch (error) {
      toast.error(`Error deleting ${entityLabel}`);
    }
  }

  useEffect(() => {
    fetchData();
  }, [entityId]);

  return {
    entity,
    form,
    setForm,
    children,
    setChildren,
    loading,
    saving,
    save,
    remove,
    fetchData,
  };
}
