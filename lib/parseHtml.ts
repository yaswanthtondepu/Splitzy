import { Item } from "@/contexts/PageContext";

const cheerio = require("cheerio");
export default function parseHtml(html: string | null) {
    const items: Item[] = [];
    const $ = cheerio.load(html);
    $(".pa3.pb0.ph4-m").each((_idx: number, el: any) => {
        var item = { name: "", image: "", price: "" };
        item["name"] = $(el).find("span").html().replaceAll(/\s\s+/g, " ");
        item["image"] = $(el).find("a").find("img").attr("src");
        item["price"] = $(el).find(".f5.b.tr").find("span").text().slice(1);
        items.push(item);
    });
    return items;
}
