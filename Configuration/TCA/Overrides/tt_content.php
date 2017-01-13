<?php
$temporaryColumn = array(
    'tgm_accordion' => array(
        'exclude' => 1,
        'label' => 'LLL:EXT:tgm_racc/Resources/Private/Language/locallang_db.xlf:ttcontent.is_accordion',
        'config' => array(
            'type' => 'check',
            'default' => 0
        )
    ),
    'tgm_accordion_open' => array(
        'exclude' => 1,
        'label' => 'LLL:EXT:tgm_racc/Resources/Private/Language/locallang_db.xlf:ttcontent.is_accordion_open',
        'config' => array(
            'type' => 'check',
            'default' => 0
        )
    )
);

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns(
    'tt_content',
    $temporaryColumn
);

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes(
    'tt_content',
    '--div--;LLL:EXT:tgm_racc/Resources/Private/Language/locallang_db.xlf:tab,tgm_accordion,tgm_accordion_open'
);