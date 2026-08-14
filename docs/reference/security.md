# Security

This page summarizes security-related information for Butler Sheet Icons (BSI), based on the original project documentation.

## Security and disclosure

Butler Sheet Icons is open source and you have access to all source code. It is your responsibility to determine if BSI is suitable for your use case. The creators of BSI, including Ptarmigan Labs, Göran Sander, or any other contributor, can and must never be held liable for past or future security issues of BSI.

If you discover a serious bug with BSI that may pose a security problem, please disclose it confidentially to [security@ptarmiganlabs.com](mailto:security@ptarmiganlabs.com) first, so it can be assessed and hopefully fixed prior to being exploited. Please do not raise GitHub issues for security-related doubts or problems.

## Platform-specific notes

### Windows {#windows-code-signing}

The Windows version of Butler Sheet Icons is signed with a proper, commercial code signing certificate issued by Certum.

::: warning Requires BSI 5.0.0 or later
5.0.0 is the first release to carry the restored signature. The previous certificate expired shortly before 4.0.0, so **4.0.0 and 4.1.0 shipped without any signature at all**. If you are running one of those, upgrading is the fix — no configuration change is needed on your side.
:::

The certificate is issued to an individual open source developer rather than to a company, so the publisher name Windows shows you is a person's name, not "Ptarmigan Labs". That is normal for open source projects and does not affect what the signature guarantees. The commands below print the exact publisher string out of the release you already hold.

Nothing about how Butler Sheet Icons works changed with the signature. It affects only how Windows treats the file.

#### What the signature does for you

**It proves where the file came from.** A valid signature confirms the executable was published by the holder of that certificate and has not been altered since — by a mirror, a proxy, or anything else between the release page and your server.

**Publisher rules work again.** Many organisations enforce application control through AppLocker or Windows Defender Application Control, commonly allowing programs by publisher certificate. Those rules can match the signed release, where they could not match the unsigned 4.0.0 and 4.1.0 downloads at all — an unsigned executable cannot be permitted by a publisher rule under any configuration.

If your Windows administrator created a file hash rule to allow an unsigned version, it is worth asking them to replace it with a publisher rule. A hash rule has to be updated for every new release; a publisher rule does not.

**Antivirus false positives become less likely.** Butler Sheet Icons is a single-file executable built from the Node.js runtime, and that construction is a common source of false positives. A valid signature helps, though it does not guarantee anything — if your antivirus still quarantines the file and you obtained it from the official release page, add an exclusion.

#### What the signature does not do

**It does not immediately silence Microsoft Defender SmartScreen.**

SmartScreen decides whether to warn based on the *reputation* it has accumulated for a file and its signing certificate, not merely on whether a signature exists. Only Extended Validation certificates receive reputation immediately; this is a standard code signing certificate, so reputation builds as more people download the release.

In practice you may still see:

> **Windows protected your PC**
> Microsoft Defender SmartScreen prevented an unrecognised app from starting.

especially in the first weeks after a new certificate is put into use. Choose **More info**, then **Run anyway**. The warning should become less frequent over time, and unlike an unsigned file, you can confirm who published it before you proceed.

#### Checking the signature yourself {#checking-the-signature-yourself}

Worth doing if you are deploying into a controlled environment, or confirming a download before distributing it internally. In PowerShell, in the folder holding the executable:

```powershell
$sig = Get-AuthenticodeSignature -LiteralPath .\butler-sheet-icons.exe
$sig | Format-List Status, StatusMessage
$sig.SignerCertificate | Format-List Subject, Issuer, Thumbprint, NotAfter
```

You can also right-click the file, choose **Properties**, and look at the **Digital Signatures** tab.

##### Check the thumbprint, not only the status

`Status` reading `Valid` means the file carries an intact signature from a certificate Windows trusts. It does **not** mean the file came from us — any correctly signed program on earth passes that test. Comparing the thumbprint is what actually confirms the publisher.

| | |
| --- | --- |
| Issuer | `CN=Certum Code Signing 2021 CA, O=Asseco Data Systems S.A., C=PL` |
| Thumbprint | `1674DF1C6EAD6DB9D816705CD230281B87A1C97E` |
| Valid | 2026-08-12 to 2027-08-12 |

The subject line — which names the individual the certificate was issued to — is printed by the commands above from the release you already hold, so it is not reproduced here.

None of this is confidential: the certificate is embedded in every signed release, so anyone holding a download can read all of it out.

Two things that surprise people:

- **The thumbprint is a SHA-1 hash _of the certificate_**, which has nothing to do with the SHA-256 digest used for the signature itself. Windows has identified certificates this way for years. It is not a weakness in the signature.
- **A renewal changes the thumbprint.** Releases signed before 2026-08-12 carry an older certificate, and releases after 2027-08-12 will carry its replacement. If the thumbprint does not match, check this page before assuming the worst.

##### Building an application control rule

If you allow programs by publisher through AppLocker or Windows Defender Application Control, you can build the rule from the publisher certificate rather than from a specific binary. Export it from any signed release:

```powershell
$sig = Get-AuthenticodeSignature -LiteralPath .\butler-sheet-icons.exe
[System.IO.File]::WriteAllBytes("$PWD\butler-sheet-icons-publisher.cer", $sig.SignerCertificate.RawData)
```

That `.cer` file is what `Add-SignerRule` expects when adding a signer to a WDAC policy. Prefer it to a file hash rule: a publisher rule keeps working across releases, while a hash rule has to be updated for every new version.

One point worth understanding: **the signature is timestamped**. It therefore stays valid after the signing certificate itself expires, so a release downloaded years from now still verifies. Without a timestamp, every previously released binary would stop validating the day the certificate lapsed.

A valid signature proves the publisher, not the download source. Always download from the [official release page](https://github.com/ptarmiganlabs/butler-sheet-icons/releases).

### macOS

The macOS version is signed and notarized by Apple's standard process. A warning may still be shown the first time the app is started. This is expected and normal.
