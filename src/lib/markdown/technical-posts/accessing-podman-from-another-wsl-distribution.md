---
title: Accessing Podman from another WSL distribution
description: Accessing Podman from another WSL distribution
date_created: '2025-05-18T00:00:00.000Z'
date_updated: '2025-11-03T00:00:00.000Z'
date_published: null
pinned: false
tags:
  - containers
---
On Windows, [Podman Desktop creates a Windows Subsystem for Linux (WSL) virtual machine: the Podman Machine](https://podman-desktop.io/docs/podman/creating-a-podman-machine). It also configures the Windows Podman client to communicate with the Podman Machine. However, it does not configure your other WSL distributions.

You might have other WSL distributions running, and want to access from there to your Podman Desktop containers.

This tutorial focuses on the most common context to walk you through the steps to configure your WSL distribution:

-   Ubuntu distribution of Linux.
-   Default Podman Machine.

In foldable details, you can find alternative steps for least common contexts:

-   Custom WSL distribution.
-   Custom Podman Machine.

## Configuring your WSL distribution[​](#configuring-your-wsl-distribution "Direct link to Configuring your WSL distribution")

1.  Start a session in your WSL distribution:

        > wsl --distribution your-distribution-name

2.  To communicate with the remote Podman Machine, you need a Podman client.

    To benefit from the latest features, such as `podman kube` subcommands, use a recent Podman version rather than the `podman` package from the distribution.

    The Podman client is available with a full `podman` installation or with the `podman-remote` version 4.x and higher. On Ubuntu it is generally easier to install `podman-remote`.

    With `podman-remote` you also enable the remote mode by default.

    Check for the latest release which includes the `podman-remote` binary from the [Podman releases page](https://github.com/containers/podman/releases/latest).

    Download and unpack the binary:

        $ wget https://github.com/containers/podman/releases/download/v4.9.1/podman-remote-static-linux_amd64.tar.gz$ sudo tar -C /usr/local -xzf podman-remote-static-linux_amd64.tar.gz

    Make this executable as `podman` with the following addition to `.bashrc`:

        $ export PATH="$PATH:/usr/local/bin"$ alias podman='podman-remote-static-linux_amd64'

3.  Configure the Podman client in your WSL distribution to communicate with the remote Podman machine defined by Podman Desktop.

    This will ensure consistency when you are working with Podman from all your different environments

    Set the default Podman system connection to your Podman Machine (assuming Podman Desktop is configured with the default of Podman Machine enabled with root privileges):

        $ podman system connection add --default podman-machine-default-root unix:///mnt/wsl/podman-sockets/podman-machine-default/podman-root.sock

    On a custom Podman Machine, the remote Podman Machine destination might be different.

    Two parameters can change:

    -   The machine name might differ from `podman-machine-default`.
    -   The socket name is different when the Podman machine has root privileges disabled (rootless mode).

    Find your Podman Machine name and connection path:

4.  The communication channel between your WSL distribution and the Podman Machine is a special file (a socket). The Podman Machine creates this file with specific permissions. To communicate with the Podman Machine from your WSL distribution your user must have write permissions for the socket.

    To give access to the remote Podman machine to your user: create the group if necessary, assign group membership, and exit your session on the WSL distribution to apply the new group membership:

        $ sudo usermod --append --groups 10 $(whoami)$ exit

## Testing the connection[​](#testing-the-connection "Direct link to Testing the connection")

Verify that, on your WSL distribution, the Podman CLI communicates with your Podman machine.

1.  Start a session in your WSL distribution:
2.  Verify that your user is member of the group delivering access to the remote Podman Machine socket:

    On the default Ubuntu WSL, the list contains the `uucp` group.

    On a custom WSL distribution, the group name might be different.

    Find the required group name:

3.  Verify that Podman default system connections is set to your remote Podman machine:

        $ podman system connection list

4.  Verify that Podman has a `Server` version corresponding to your Podman Machine version:

    Sample output:

        Client:Version:      3.4.4API Version:  3.4.4Go Version:   go1.18.1Built:        Thu Jan 1 01:00:00 1970OS/Arch:      linux/amd64Server:Version:      4.8.3API Version:  4.8.3Go Version:   go1.21.5Built:        Wed Jan 3 15:11:40 2024OS/Arch:      linux/amd64

    info

    On your environment, the Podman version might be different.

5.  Verify that you can list running containers.

    On your WSL distribution, start a container such as `quay.io/podman/hello`, and list the name of the last running container:

        $ podman run quay.io/podman/hello$ podman ps -a --no-trunc --last 1

    On **Podman Desktop > Containers**, the output lists the same container (same name, same image).

## Changing the connection[​](#changing-the-connection "Direct link to Changing the connection")

Podman Desktop only has visibility to either rootless or rootful containers but not both at the same time.

To change the active connection:

1.  In your Windows terminal, change the connection:

    -   To set the connection to rootless:

            $ podman machine set --rootful=false

    -   To set the connection to rootful:

            $ podman machine set --rootful=true

2.  In your WSL session, Change the Podman system connection configuration:

    -   To set the connection to rootless:

            $ podman system connection add --default podman-machine-default-user unix:///mnt/wsl/podman-sockets/podman-machine-default/podman-user.sock

    -   To set the connection to rootful:

            $ podman system connection add --default podman-machine-default-root unix:///mnt/wsl/podman-sockets/podman-machine-default/podman-root.sock

## Next steps[​](#next-steps "Direct link to Next steps")

-   From your WSL distribution, [work with containers](https://podman-desktop.io/docs/containers).