<?php
if (!defined('TYPO3_MODE')) {
	die('Access denied.');
}

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($_EXTKEY, 'Configuration/TypoScript', 'TgM remember accordion');

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addLLrefForTCAdescr('tx_tgmracc_domain_model_ttcontent', 'EXT:tgm_racc/Resources/Private/Language/locallang_csh_tx_tgmracc_domain_model_ttcontent.xlf');
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::allowTableOnStandardPages('tx_tgmracc_domain_model_ttcontent');
