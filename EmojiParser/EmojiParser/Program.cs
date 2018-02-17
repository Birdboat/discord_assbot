using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace EmojiParser
{
    class Program
    {
        struct Emoji
        {
            public string MainCode;
            public string[] Modifiers;
            public bool Qualified;
            public string RawEmoji;
            public string Description;
            public string Unicode;
            public string JSName;
        }

        class EmojiCache
        {
            private List<Emoji> Emojis;

            public EmojiCache()
            {
                Emojis = new List<Emoji>();
            }

            /// <summary>
            /// Converts mods into readable appendages that kinda make sense
            /// required because im too lazy to figure out how to name them properly
            /// </summary>
            /// <param name="qualifier">qualifier</param>
            /// <returns></returns>
            string ConvertUnicodeQualifier(string qualifier)
            {
                switch(qualifier)
                {
                    case "FE0F":
                        return "_var";

                    case "2640":
                        return "_femalesign";

                    case "200D":
                        return "";

                    case "20E3":
                        return "";

                    default:
                        return "_" + qualifier;
                }
            }

            public string add(string emojiline)
            {
                /*
                 * Samples: 
                 * 1F600                                      ; fully-qualified     # 😀 grinning face
                 * 263A FE0F                                  ; fully-qualified     # ☺️ smiling face
                 * 263A                                       ; non-fully-qualified # ☺ smiling face
                 * */
                Emoji emoji;
                string[] split = emojiline.Split(';');
                string MainandMods = split[0].Trim();
                string QualifiedElse = split[1];

                // MainandMods
                string[] all = MainandMods.Split(' ');
                string main = all[0];
                string[] mods = all.Where(m => m != all[0]).ToArray();
                StringBuilder unicode = new StringBuilder();
                foreach(string mod in all)
                {
                    unicode.Append(@"\u{" + mod + "}");
                }

                // QualifiedElse
                string qualified = QualifiedElse.Substring(1, QualifiedElse.IndexOf("#") - 1).Trim();
                string dummy = QualifiedElse.Substring(QualifiedElse.IndexOf("#") + 2);
                int secondspace = dummy.IndexOf(" ");
                string rawemoji = dummy.Substring(0, secondspace);
                string description = dummy.Substring(secondspace).Trim();

                StringBuilder jsname = new StringBuilder();
                jsname.Append(description.Replace(' ', '_').Replace(':', '_').Replace('-', '_').Replace(',', '_').Replace('.', '_').Replace('’', '_')
                    .Replace("1st", "first").Replace("2nd", "second").Replace("3rd", "third").Replace("!", "").Replace("#", "number").Replace("*", "astrisk")
                    .Replace('(', '_').Replace(')', '_').Replace('“', '_').Replace('”', '_').Replace('"', '_').Replace('&', '_'));
                foreach (string mod in mods)
                {
                    jsname.Append(ConvertUnicodeQualifier(mod));
                }

                emoji.MainCode = main;
                emoji.Modifiers = mods;
                emoji.Qualified = qualified == "fully-qualified" ? true : false;
                emoji.RawEmoji = rawemoji;
                emoji.Description = description;
                emoji.Unicode = "\"" + unicode.ToString() + "\"";
                emoji.JSName = jsname.ToString().Replace("__", "_").Replace("___", "_");

                Emojis.Add(emoji);

                string ret = 
                   string.Format("\t/**\n\t* Unicode: {0}\n\t*\n\t* Qualified: {1}\n\t*\n\t* Description: {2}\n\t*\n\t* {3}\n\t*/\n\t{4}: {5},", emoji.MainCode + " " + MainandMods, emoji.Qualified, emoji.Description, emoji.RawEmoji, emoji.JSName, emoji.Unicode);
                return ret;
            }
        }

        static void Main(string[] args)
        {
            const string UrlBase = "http://www.unicode.org/Public/emoji/";
            const string version = "11.0";
            const string RawFolderName = "Raw";
            const string EditedFolderName = "Formatted";
            string FullUrl = UrlBase + version + "/emoji-test.txt";
            string BaseDirectory = Directory.GetParent(Directory.GetParent(Environment.CurrentDirectory).FullName).FullName;

            if (!Directory.Exists(Path.Combine(BaseDirectory, RawFolderName, version)))
            {
                Directory.CreateDirectory(Path.Combine(BaseDirectory, RawFolderName, version));
            }

            if (!File.Exists(Path.Combine(BaseDirectory, RawFolderName, version) + "/emoji-test.txt"))
            {
                Console.WriteLine("emoji-test.txt doesn't exist, downloading...");
                using (var wb = new WebClient())
                {
                    wb.DownloadFile(FullUrl, Path.Combine(BaseDirectory, RawFolderName, version) + "/emoji-test.txt");
                }
                Console.WriteLine("Downloaded file");
            }
            else Console.WriteLine("emoji-test.txt exists");

            if (!Directory.Exists(Path.Combine(BaseDirectory, EditedFolderName, version)))
            {
                Directory.CreateDirectory(Path.Combine(BaseDirectory, EditedFolderName, version));
            }

            if (!File.Exists(Path.Combine(BaseDirectory, EditedFolderName, version) + "/emojis.ts"))
            {
                Console.WriteLine("emojis.ts doesn't exist, formatting...");
                EmojiCache Cache = new EmojiCache();
                using (StreamWriter file = new StreamWriter(Path.Combine(BaseDirectory, EditedFolderName, version) + "/emojis.ts"))
                {
                    string[] lines = File.ReadAllLines(Path.Combine(BaseDirectory, RawFolderName, version) + "/emoji-test.txt");
                    file.WriteLine("export var Emojis = {");
                    foreach (string line in lines)
                    {
                        if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#") ^ (line.StartsWith("# group:") || line.StartsWith("# subgroup:"))) continue;
                        string res = "";
                        if (line.StartsWith("#"))
                        {
                            file.WriteLine();
                            res = "\t" + line.Substring(1).Insert(0, "//");
                        }else
                        {
                            res = Cache.add(line);
                            file.WriteLine();
                        }
                        file.WriteLine(res);
                    }
                    file.WriteLine("};");
                }
                Console.WriteLine("Formatted file");
            }
            else Console.WriteLine("emojis.ts already formatted");

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}
