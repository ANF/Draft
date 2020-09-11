using System;
using System.IO;
using System.Linq;
using ListManager.Core;
using System.Collections.Generic;

namespace ListManager
{
    public class Cmds
    {
        public static void Commands()
        {
            string Command = Console.ReadLine();
            switch (Command)
            {
                case "-Help":
                case "-help":
                case "-cmds":
                case "-commands":
                    Console.Clear();
                    Console.WriteLine(
@"Here are a list of available commands:
                
create/add
Creates a list with specifed name and items

delete/remove
Deletes an existing list.

view
Shows a list of saved lists

list/open
Shows the saved list

version
Shows the version of application currently running

Note: All commands must start the prefix '-'");
                    Commands();
                    break;

                case "-v":
                case "-version":
                    Console.Clear();
                    Console.WriteLine("This is List Manager running v0.1aot");
                    Commands();
                    break;

                case "-create":
                case "-add":
                    Console.Clear();
                    CreationInitialize();
                    break;

                case "-delete":
                case "-remove":
                    Console.WriteLine("What is the name of the list that you want to delete?");
                    string listDel = Console.ReadLine();
                    DeletionInitialize(listDel);
                    break;

                case "-view":
                    ViewList.ListNames();
                    break;

                case "-list":
                case "-open":
                    Console.WriteLine("What is the name of the list?");
                    string name = Console.ReadLine();
                    ListViewInitialize(name);
                    break;

                default:
                    Console.WriteLine($"{Command} is not valid or recognized!");
                    Commands();
                    break;
            }
        }

        private static void ListViewInitialize(string choice)
        {
            string[] GetFiles = Directory.GetFiles(@"C:\Users\Public\Documents\ListManager", "*.list");
            List<string> Possible = new List<string>();

            foreach (string ListToSep in GetFiles)
            {
                string GetFilesFinal = Path.GetFileNameWithoutExtension(ListToSep);
                Possible.Add(GetFilesFinal);
                //Console.WriteLine(GetFilesFinal);
            }

            if (Possible.Contains(choice))
            {
                Console.WriteLine("Opening file!");
                ViewList.ListView(choice);
            }

            else
            {
                Console.WriteLine("No such file found! Run the command again!");
                Commands();
            }
        }

        private static void CreationInitialize()
        {
            Console.WriteLine("What should be the name of the list?");
            string listName = Console.ReadLine();

            string[] GetFiles = Directory.GetFiles(@"C:\Users\Public\Documents\ListManager");
            foreach (string file in GetFiles)
            {
                var GetFilesWE = Path.GetFileNameWithoutExtension(file);

                if (GetFilesWE == listName)
                {
                    Console.WriteLine("Using this name will override the current list with this name");
                    CreationInitialize();
                }
            }
            GC.Collect();
            ListCreator.ListCreation(listName);
        }

        private static void DeletionInitialize(string choice)
        {
            string[] GetFiles = Directory.GetFiles(@"C:\Users\Public\Documents\ListManager", "*.list");
            List<string> Possible = new List<string>();

            foreach (string ListToSep in GetFiles)
            {
                string GetFilesFinal = Path.GetFileNameWithoutExtension(ListToSep);
                Possible.Add(GetFilesFinal);
                //Console.WriteLine(GetFilesFinal);
            }

            if (Possible.Contains(choice))
            {
                Console.WriteLine("Deleting File..");
                DeleteManager.DeleteList(choice);
            }

            else
            {
                Console.WriteLine("No such file found! Run the command again!");
                Commands();
            }
        }
    }
}
