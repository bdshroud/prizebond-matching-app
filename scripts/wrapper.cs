using System;
using System.Diagnostics;
using System.IO;
using System.Linq;

class Program {
    static int Main(string[] args) {
        string real7z = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "7za_real.exe");
        if (!File.Exists(real7z)) {
            real7z = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "7za.original.exe");
        }
        
        var argList = args.ToList();
        // Prevent Windows symlink privilege failure by excluding darwin macOS folder
        if (argList.Contains("x") || argList.Contains("e")) {
            if (!argList.Any(a => a.StartsWith("-xr!"))) {
                argList.Add("-xr!darwin");
            }
            if (!argList.Contains("-y")) {
                argList.Add("-y");
            }
        }

        ProcessStartInfo psi = new ProcessStartInfo();
        psi.FileName = real7z;
        psi.Arguments = string.Join(" ", argList.Select(a => a.Contains(" ") ? "\"" + a + "\"" : a));
        psi.UseShellExecute = false;

        using (Process p = Process.Start(psi)) {
            p.WaitForExit();
            return p.ExitCode;
        }
    }
}
