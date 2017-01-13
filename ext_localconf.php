<?php
if (!defined('TYPO3_MODE')) {
    die ('Access denied.');
}

// XCLASS
//Load mask xclass when the extenssion is loaded. needed to add the accordion tca fields
if(\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::isLoaded('mask')){
    $GLOBALS['TYPO3_CONF_VARS']['SYS']['Objects'][MASK\Mask\CodeGenerator\TcaCodeGenerator::class] = array('className' => TGM\TgmRacc\Xclass\Mask\TcaCodeGenerator::class);
}



