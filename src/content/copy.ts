const pad2 = (n: number) => String(n).padStart(2, "0");

export const plate = {
  /** "ÖLÇEK 1:1 — LEVHA 02/05" */
  label: (no: number, total: number) => `ÖLÇEK 1:1 — LEVHA ${pad2(no)}/${pad2(total)}`,
};
