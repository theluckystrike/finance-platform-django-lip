import { useMemo, useState } from "react";

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

const useSortableData = (items: any[], config: SortConfig | null = null) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(config);

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        const isDate = !isNaN(Date.parse(aValue)) && !isNaN(Date.parse(bValue));

        if (isDate) {
          const dateA = new Date(aValue);
          const dateB = new Date(bValue);

          if (dateA < dateB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (dateA > dateB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        } else {
          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (key: string) => {
    if (!sortConfig) {
      return "d-none";
    }
    return sortConfig.key === key ? sortConfig.direction : "d-none";
  };

  return { items: sortedItems, requestSort, getClassNamesFor, sortConfig };
};

export default useSortableData;
