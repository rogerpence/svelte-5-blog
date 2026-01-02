---
title: C# command line processor; cocona; commandlineparser; cli
description: C# command line processor; cocona; commandlineparser; cli
date_created: '2025-07-13T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - csharp
  - cli
---
[Command Line Parser Nuget package](https://www.nuget.org/packages/CommandLineParser)

![[image-37.png]]

```cs
using CommandLine;

namespace cli_test
{
    internal class Program
    {
        public class Options
        {
            [Option('v', "verbose", Required = false, HelpText = "Set output to verbose messages.")]
            public bool Verbose { get; set; }

            [Option('p', "FilePath", Required = false, HelpText = "Set file path.")]
            public string FilePath { get; set; } = "Roger";

        }
        static void Main(string[] args)
        {
            Parser.Default.ParseArguments<Options>(args)
                .WithParsed<Options>(o =>
                {
                    if (o.Verbose)
                    {
                        Console.WriteLine($"Current Arguments (verbose): -v {o.Verbose}");
                        Console.WriteLine("Quick Start Example! App is in Verbose mode!");
                    }
                    else
                    {
                        Console.WriteLine($"Current Arguments: -v {o.Verbose}");
                        Console.WriteLine("Quick Start Example!");
                    }

                    Console.WriteLine(o.FilePath);
                });
        }
    }
}
```