using System;
using System.IO;
using System.Collections.Generic;
using ListManager;

namespace ListManager.IO
{
    public class IOFunctions
    {
        ///<summary>
        /// Creates a list
        ///</summary>
        public static void ListCreation(string listName)
        {
            List<string> UserList = new List<string>();
            Console.WriteLine("Enter the items to add, seperate with enter key:");

            string item = Console.ReadLine();
            UserList.Add(item);

            Console.WriteLine($"Added {item}, to finish list, use '-stop' or '-finish'");

            string input = Console.ReadLine();

            if (input == "-stop" || input == "-finish")
            {
                if (!Directory.Exists("C:\\Users\\Public\\Documents\\ListManager"))
                {
                    Directory.CreateDirectory("C:\\Users\\Public\\Documents\\ListManager");
                }

                Console.WriteLine($"List completed!\nHere is the list: {item}");
                Cmds.Commands();
            }

            else
            {
                while (UserList.Count < 100)
                {
                    item = Console.ReadLine();

                    if (item == "-stop" || item == "-finish")
                    {
                        if (!Directory.Exists($"C:\\Users\\Public\\Documents\\ListManager"))
                        {
                            Directory.CreateDirectory($"C:\\Users\\Public\\Documents\\ListManager");
                        }
                        CreateFile(listName, UserList);
                        Console.WriteLine("Here is the list:");

                        foreach (string FinalList in UserList)
                        {
                            Console.WriteLine(FinalList);
                        }
                        Cmds.Commands();
                    }

                    else
                    {
                        UserList.Add(item);
                    }
                }

                while (UserList.Count > 100)
                {
                    Console.WriteLine("You cannot exceed the 100 item limit");

                    if (!Directory.Exists($"C:\\Users\\Public\\Documents\\ListManager"))
                    {
                        Directory.CreateDirectory($"C:\\Users\\Public\\Documents\\ListManager");
                    }
                    CreateFile(listName, UserList);
                    Console.WriteLine("Here is the list:");

                    foreach (string FinalList in UserList)
                    {
                        Console.WriteLine(FinalList);
                    }
                    Cmds.Commands();
                }
            }

            ///<summary>
            /// Creates the file
            ///</summary>
            static void CreateFile(string listName, List<string> UserList)
            {
                File.WriteAllLines($"C:\\Users\\Public\\Documents\\ListManager\\{listName}.list", UserList);
            }
        }

        ///<summary>
        /// Displays the contents in a list
        ///</summary>
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
                Console.WriteLine("FATAL ERROR!");
                Console.WriteLine("Please give these details to the publisher:\n" + ex);
            }
            GC.Collect();
            Cmds.Commands();
        }

        ///<summary>
        /// Shows the names of saved lists
        ///</summary>
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

        ///<summary>
        /// Deletes a list
        ///</summary>
        public static void DeleteList(string ListToDelete)
        {
            try
            {
                if(File.Exists($@"C:\Users\Public\Documents\ListManager\{ListToDelete}.list"))
                {
                    File.Delete($@"C:\Users\Public\Documents\ListManager\{ListToDelete}.list");
                    Console.WriteLine("Done!");
                    Cmds.Commands();
                }

                else
                {
                    Console.Beep();
                    Console.WriteLine("FATAL ERROR! File not found!");
                    throw new FileNotFoundException();
                }
            }
            
            catch (Exception ex)
            {
                Console.Beep();
                Console.WriteLine("FATAL ERROR! File not found!");
                Console.WriteLine("Please give these details to the publisher:\n" + ex);
            }
        }


    }
}
