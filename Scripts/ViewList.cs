using System;
using System.IO;
using System.Collections.Generic;

namespace ListManager.Core
{
    public class ViewList
    {
        public static void ListView(string listName)
        {
            Console.Title = $"List Manager - {listName}";
            Console.Clear();
            Console.WriteLine("Here is the list:");

            try
            {
                string[] GetList = File.ReadAllLines($@"C:\Users\Public\Documents\ListManager\{listName}.list");
                foreach (string itemOfList in GetList)
                {
                    Console.WriteLine(itemOfList);
                }

                Console.WriteLine("___________________________");
            }

            catch (Exception ex)
            {
                Console.Beep();
                Console.WriteLine("FATAL ERROR! File not found!");
                Console.WriteLine("Please give these details to the publisher:\n" + ex);
            }
            GC.Collect();
            Cmds.Commands();
        }

        public static void ListNames()
        {
            Console.Clear();
            Console.WriteLine("Here are the saved lists:");

            //Man this part was hard
            string[] GetFiles = Directory.GetFiles(@"C:\Users\Public\Documents\ListManager");
            foreach (string file in GetFiles)
            {
                var GetFilesWE = Path.GetFileNameWithoutExtension(file);
                Console.WriteLine(GetFilesWE);
            }
            Cmds.Commands();
        }
    }
}
