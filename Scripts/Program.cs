using System;
using System.IO;
using System.Diagnostics;

namespace ListManager
{
    class Program
    {
        static void Main()
        {
            Initialize();
            MoveToCmds();

            //Beep if it reaches here for some reason
            Console.Beep();
            Console.ReadKey();
        }

        static void MoveToCmds()
        {
            Cmds.Commands();
            System.Threading.Tasks.Task.Delay(-1).Wait();
        }

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
                var rnd = new Random()
                .Next(250, 1250);

                Console.Write("Initializing..");
                System.Threading.Thread.Sleep(rnd);
                Console.Clear();
                Console.WriteLine("Welcome to the list manager");
                Console.WriteLine("To view a list of commands, use \"-help\"");
                GC.Collect();
                MoveToCmds();
            }
        }
    }
}
