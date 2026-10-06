import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { OutreachLogItem } from "../lib/types";

// Tolerates an empty log. Counts only recorded events.
const items = JSON.parse(
  readFileSync(resolve("data/outreach-log.json"), "utf8")
) as OutreachLogItem[];

const byStatus = (status: OutreachLogItem["status"]) =>
  items.filter((item) => item.status === status).length;
const byCategory = (category: OutreachLogItem["category"]) =>
  items.filter((item) => item.category === category).length;

console.log("ARKIVE OUTREACH STATUS");
console.log("======================");
console.log(`Sent: ${byStatus("sent")}`);
console.log(`Replied: ${byStatus("replied")}`);
console.log(`Review scheduled: ${byStatus("review_scheduled")}`);
console.log(`Review completed: ${byStatus("review_completed")}`);
console.log(`Declined: ${byStatus("declined")}`);
console.log(`No response: ${byStatus("no_response")}`);
console.log("");
console.log("By category:");
console.log(`Historian: ${byCategory("historian")}`);
console.log(`Educator: ${byCategory("educator")}`);
console.log(`Archive: ${byCategory("archive")}`);
console.log(`Community: ${byCategory("community")}`);
console.log(`Digital humanities: ${byCategory("digital_humanities")}`);
console.log("");
console.log(items.length === 0 ? "Log is empty. No outreach has been recorded." : `Total logged contacts: ${items.length}`);
