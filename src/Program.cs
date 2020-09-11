using System;
using System.IO;
using System.Diagnostics;

namespace ListManager
{
    class Program
    {
        ///<summary>
        /// Main method to run this application
        ///</summary>
        static void Main()
        {
            Initialize();
            MoveToCmds();

            //Beep if it reaches here for some reason
            Console.Beep();
            Console.Clear();
            Console.Write("Press any key to close..");
            Console.ReadKey();
        }

        ///<summary>
        /// Goes to the command module and make sures that it stays there
        ///</summary>
        static void MoveToCmds()
        {
            Cmds.Commands();
            //Beep if it reaches here for some reason
            Console.Beep();
            Console.Clear();
            Console.Write("Press any key to close..");
            Console.ReadKey();
        }

        ///<summary>
        /// Starts the application
        ///</summary>
        static void Initialize()
        {
            if (Process.GetProcessesByName(Path.GetFileNameWithoutExtension(System.Reflection.Assembly.GetEntryAssembly().Location)).Length > 1)
            {
                Console.WriteLine("Another session is already running! Terminating in 5 seconds");
                System.Threading.Thread.Sleep(5000);
                Process.GetCurrentProcess().Kill();
            }
            
            else
            {
                Console.Title = "List Manager";
                Console.WriteLine("Welcome to the list manager");
                Console.WriteLine("To view a list of commands, use \"-help\"");
                GC.Collect();
                MoveToCmds();
            }
        }
    }
}
