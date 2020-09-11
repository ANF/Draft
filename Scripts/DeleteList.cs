using System;
using System.IO;

namespace ListManager.Core
{
    public class DeleteManager
    {
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
