# Security

This page summarizes security-related information for Butler Sheet Icons (BSI), based on the original project documentation.

## Security and disclosure

Butler Sheet Icons is open source and you have access to all source code. It is your responsibility to determine if BSI is suitable for your use case. The creators of BSI, including Ptarmigan Labs, Göran Sander, or any other contributor, can and must never be held liable for past or future security issues of BSI.

If you discover a serious bug with BSI that may pose a security problem, please disclose it confidentially to [security@ptarmiganlabs.com](mailto:security@ptarmiganlabs.com) first, so it can be assessed and hopefully fixed prior to being exploited. Please do not raise GitHub issues for security-related doubts or problems.

## Platform-specific notes

### Windows {#windows-code-signing}

The Windows version of Butler Sheet Icons is signed by **Ptarmigan Labs AB**, the company behind it, through Microsoft's Azure Artifact Signing service. Windows shows Ptarmigan Labs AB as the publisher.

::: warning Requires BSI 5.2.1 or later
Earlier Windows downloads carry a different signature, or none at all. See the table below.
:::

| Release | Signed by |
| --- | --- |
| 5.2.1 and later | Ptarmigan Labs AB, through Azure Artifact Signing |
| 5.0.0 to 5.2.0 | A Certum certificate issued to an individual open source developer, so Windows shows a person's name as the publisher |
| 4.0.0 and 4.1.0 | Not signed. The certificate before Certum's expired shortly before 4.0.0 |

Nothing about how Butler Sheet Icons works changed with the signature. It affects only how Windows identifies the file, and what an application control rule has to match.

A release never carries an unsigned Windows download. The download is attached to a release only after its signature has been checked, so if signing fails, that release has no Windows download. The insiders builds, test builds published from the development branch, are not signed on Windows.

#### What the signature does for you

**It proves where the file came from.** A valid signature confirms the executable was published by Ptarmigan Labs AB and has not been altered since — by a mirror, a proxy, or anything else between the release page and your server.

**Publisher rules can match it.** Many organisations enforce application control through AppLocker or Windows Defender Application Control, commonly allowing programs by publisher. Such a rule can match a signed release, while an unsigned executable such as the 4.0.0 and 4.1.0 downloads cannot be permitted by a publisher rule under any configuration. See [Building an application control rule](#building-an-application-control-rule) below.

If your Windows administrator created a file hash rule to allow an earlier version, it is worth asking them to replace it with a publisher rule. A hash rule has to be updated for every new release; a publisher rule does not.

**Antivirus false positives become less likely.** Butler Sheet Icons is a single-file executable built from the Node.js runtime, and that construction is a common source of false positives. A valid signature helps, though it does not guarantee anything — if your antivirus still quarantines the file and you obtained it from the official release page, add an exclusion.

#### What the signature does not do

**It does not immediately silence Microsoft Defender SmartScreen.**

SmartScreen decides whether to warn from the *reputation* a publisher and a file have built up, not merely from whether a signature exists, and a newly published release has none yet.

In practice you may still see:

> **Windows protected your PC**
> Microsoft Defender SmartScreen prevented an unrecognised app from starting.

especially in the first days after a release. Choose **More info**, check that the publisher reads Ptarmigan Labs AB, then **Run anyway**.

#### Checking the signature yourself {#checking-the-signature-yourself}

Worth doing if you are deploying into a controlled environment, or confirming a download before distributing it internally. In PowerShell, in the folder holding the executable:

```powershell
$sig = Get-AuthenticodeSignature -LiteralPath .\butler-sheet-icons.exe
$sig | Format-List Status, StatusMessage
$sig.SignerCertificate | Format-List Subject, Issuer, NotBefore, NotAfter
$sig.TimeStamperCertificate | Format-List Subject
```

You can also right-click the file, choose **Properties**, and look at the **Digital Signatures** tab.

##### Check the publisher, not only the status

`Status` reading `Valid` means the file carries an intact signature from a certificate Windows trusts. It does **not** mean the file came from us — any correctly signed program on earth passes that test. The subject naming **Ptarmigan Labs AB** is what confirms the publisher.

| | |
| --- | --- |
| Issued to (publisher) | `Ptarmigan Labs AB` |
| Issued by | One of Microsoft's ID Verified issuing CAs, such as `Microsoft ID Verified CS AOC CA 03` or `Microsoft ID Verified CS EOC CA 03`. Which one can differ from one release to the next |
| Above that | `Microsoft ID Verified Code Signing PCA 2021`, under `Microsoft Identity Verification Root Certificate Authority 2020` |
| Timestamped by | `Microsoft Public RSA Time Stamping Authority` |
| Certificate lifetime | 72 hours. Every release is signed with a new certificate, so the thumbprint changes from one release to the next |

`NotAfter` is a date a few days after the release, and will usually be in the past by the time you check. That is expected. **The signature is timestamped** when the release is signed, and Windows checks the certificate against that moment rather than against today, so `Status` still reads `Valid`.

None of this is confidential: the certificate is embedded in every signed release, so anyone holding a download can read all of it out.

##### Building an application control rule {#building-an-application-control-rule}

Build the rule on the publisher, **Ptarmigan Labs AB**. It is the part of the certificate that stays the same from one release to the next.

- **Do not pin the rule to one certificate or thumbprint.** Artifact Signing replaces the certificate every day, so a rule pinned to one certificate matches only the releases signed with it. That includes a WDAC signer rule built with `Add-SignerRule` from a certificate exported from one release, as earlier versions of this page suggested.
- **Do not build the rule on the issuing CA either.** It is not fixed: Microsoft issues these certificates from more than one CA.
- **AppLocker:** a publisher rule matches on the publisher name, so a rule for Ptarmigan Labs AB keeps matching new releases.
- **Windows Defender Application Control (App Control for Business):** Microsoft gives each Artifact Signing certificate profile a durable identifier for writing rules that survive the daily renewals. It is an Extended Key Usage (EKU) value starting `1.3.6.1.4.1.311.97.`, the same in every certificate the profile issues. How to use it in a policy is described in [Artifact Signing certificate management](https://learn.microsoft.com/en-us/azure/artifact-signing/concept-certificate-management) on Microsoft Learn. To read it from a release:

  ```powershell
  $sig = Get-AuthenticodeSignature -LiteralPath .\butler-sheet-icons.exe
  $sig.SignerCertificate.EnhancedKeyUsageList
  ```

- **A rule written for 5.0.0 to 5.2.0 does not match 5.2.1 or later.** The publisher, the issuer and the certificate are all different. Add a rule for Ptarmigan Labs AB before you roll out the new version, or the new version is blocked where the old one ran.
- **File hash rules are unaffected.** Every release has a new hash anyway, as before.

A valid signature proves the publisher, not the download source. Always download from the [official release page](https://github.com/ptarmiganlabs/butler-sheet-icons/releases).

### macOS

The macOS version is signed and notarized by Apple's standard process. A warning may still be shown the first time the app is started. This is expected and normal.
