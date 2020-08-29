using System;
using System.IO;
using System.Collections.Generic;

namespace ListManager.Core
{
    public class ListCreator
    {
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
                if (!Directory.Exists($"C:\\Users\\Public\\Documents\\ListManager"))
                {
                    Directory.CreateDirectory($"C:\\Users\\Public\\Documents\\ListManager");
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

            static void CreateFile(string listName, List<string> UserList)
            {
                File.WriteAllLines($"C:\\Users\\Public\\Documents\\ListManager\\{listName}.list", UserList);
            }
        }
    }
}
